#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import jinja2
import os
from google.appengine.ext import db
from xml.dom import minidom
import random
import pickle

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), 
	autoescape = True)

class MainHandler(webapp2.RequestHandler):
    def write(self, *args, **kwargs):
        self.response.out.write(*args, **kwargs)
        
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kwargs):
        self.write(self.render_str(template, **kwargs))

class Games(db.Model):
    game_creation_time = db.DateTimeProperty(auto_now_add=True)
    #dimension = db.IntegerProperty(required=True)
    player1_name = db.StringProperty(required=True)
    player2_name = db.StringProperty(required=True)
    player1_color = db.StringProperty(required=True)
    player2_color = db.StringProperty(required=True)
    player1_email = db.StringProperty(required=True)
    player2_email = db.StringProperty(required=True)
    gameplay_key = db.StringProperty(required=True)
    player1_link = db.StringProperty(required=True)
    player2_link = db.StringProperty(required=True)
    moves = db.TextProperty(required=True)

    
class HomePage(MainHandler):
    def get(self):
        games=Games.all()
        self.render("home.html", games=games)
    def post(self):

        d = 'abcdefghijklmnopqrstuvwxyz123456789'
        games = Games.all()
        total_links = []
        total_gameplay_keys = []
        for game in games:
            link = game.gameplay_key
            total_gameplay_keys.append(link)
            p1_link = game.player1_link
            p2_link = game.player2_link
            total_links.append(p1_link)
            total_links.append(p2_link)

        player1_key = "".join([d[random.randrange(0, len(d))] for x in range(10)])
        player2_key = "".join([d[random.randrange(0, len(d))] for x in range(10)])

        while player1_key in total_links:
            player1_key = "".join([d[random.randrange(0, len(d))] for x in range(10)])
        total_links.append(player1_key)

        while player2_key in total_links:
            player2_key = "".join([d[random.randrange(0, len(d))] for x in range(10)])

        gameplay_temp_file_name = "".join([d[random.randrange(0, len(d))] for x in range(20)])

        while gameplay_temp_file_name in total_gameplay_keys:
            gameplay_temp_file_name = "".join([d[random.randrange(0, len(d))] for x in range(20)])

        moves = []
        pickle_moves_string = pickle.dumps(moves)
        new_game = Games(
                        player1_name = self.request.get('player1_name'),
                        player2_name = self.request.get('player2_name'),
                        player1_color = self.request.get('p1_color'),
                        player2_color = self.request.get('p2_color'),
                        player1_email = self.request.get('p1_email'),
                        player2_email = self.request.get('p2_email'),
                        gameplay_key = gameplay_temp_file_name,
                        player1_link = player1_key,
                        player2_link = player2_key,
                        moves = pickle_moves_string
                    )
        new_game.put()
        # add code here to send email to each player

        self.write('game has been created')

class PlayGame(MainHandler):
    def get(self):
        current_url = self.request.url
        player_number = None
        player_color = None
        current_game = None
        link = current_url[23:]
        games = Games.all()
        for game in games:
            if game.player1_link == link:
                player_number = 1
                player_color = game.player1_color
                current_game = game
                break
            elif game.player2_link == link:
                player_number = 2
                player_color = game.player2_color
                current_game = game
                break
        # current_game.moves = pickle.dumps([])
        # current_game.put()
        moves = pickle.loads(current_game.moves)
        player_data=[player_number, player_color]
        #self.write((moves, player_data))
        brand_new_game = False
        if len(moves) == 0:
            brand_new_game = True
        self.render('displayboard.html',
                    move_history=moves,
                    player_info=player_data, 
                    is_brand_new=brand_new_game
                    )
    def post(self):
        opposing_colors = {'b':'w', 'w':'b'}
        new_moves = self.request.get("move_to_add_db")
        link = self.request.url[23:]
        games = Games.all()
        curr_game = None
        for game in games:
            if game.player1_link == link or game.player2_link == link:
                curr_game = game

        moves_db = pickle.loads(curr_game.moves)
        if new_moves != 'pass':
            new_moves = new_moves.split(',')
            moves_db.append(new_moves)
        else:
            #white will always start first
            if len(moves_db) == 0:
                moves_db.append(['1', 'w', 'pass'])
            else:
                last_move = moves_db[len(moves_db)-1]
                turnIncremented = int(last_move[0]) + 1
                color_of_passer = opposing_colors[last_move[1]]
                moves_db.append(['10', 'w', 'pass'])
        curr_game.moves = pickle.dumps(moves_db)
        curr_game.put()

        

#games = Games.all()

# black_links = []
# white_links = []
# # dylan change this later
# for game in games:
#     if game.player1_color == 'black':
#         black_links.append(game.player1_link)
#         white_links.append(game.player2.link)
#     else:
#         black_links.append(game.player1_link)
#         white_links.append(game.player2.link)

# new_urls = []
# for black_link in black_links:
#     new_urls.append([black_link, PlayGameAsBlack])
# for white_link in white_links:
#     new_urls.append([white_link, PlayGameAsWhite])



    
app = webapp2.WSGIApplication([
    ('/', HomePage),
    (r'/[a-z0-9]+', PlayGame)
], debug=True)
