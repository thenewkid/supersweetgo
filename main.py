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
import json
from google.appengine.ext import db
from google.appengine.api import mail
from xml.dom import minidom
import random
import pickle
import string
import re

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
    moves = db.TextProperty(required=True)
    game_info = db.TextProperty(required=True)
    @classmethod
    def init_entity(cls, p1n, p2n, 
                    p1eml, p2eml, p1_key, 
                    p2_key, game_key):
        init_moves = pickle.dumps([])
        d = {'p1_name': p1n, 'p2_name': p2n, 'p1_email': p1eml,'p2_email': p2eml,'p1_key': p1_key, 'p2_key': p2_key,'game_key': game_key
            }
        init_game = pickle.dumps(d)
        game_to_put = Games(
            moves = init_moves,
            game_info = init_game
        )
        game_to_put.put()

    @classmethod
    def player_keyz(cls):
        games = Games.all()
        total_keys = []
        for g in games:
            total_keys.append(load_game_info(g)['p1_key'])
            total_keys.append(load_game_info(g)['p2_key'])
        return total_keys

    @classmethod
    def by_link(cls, link):
        for g in Games.all():
            p1_link = load_game_info(g)['p1_key']
            if link == p1_link:
                return g
            else:
                p2_link = load_game_info(g)['p2_key']
                if link == p2_link:
                    return g

    @classmethod 
    def game_keys(cls):
        game_keys = []
        for g in Games.all():
            game_keys.append(load_game_info(g)['game_key'])
        return game_keys

def load_game_info(game_object):
    return pickle.loads(game_object.game_info)

def load_moves(game_obj):
    return pickle.loads(game_obj.moves)

def create_player_key():
    return "".join([get_hash()[random.randrange(0, len(get_hash()))] for n in range(10)])

def create_game_key():
    return "".join([get_hash()[random.randrange(0, len(get_hash()))] for n in range(15)])

def get_hash():
    return string.letters + string.digits
def get_keys():
    games = Games.all()

    if games.count() == 0:
        p1_key = create_player_key()
        p2_key = create_player_key()
        game_key = create_game_key()
        while p2_key == p1_key:
            p2_key = create_player_key()

        return (p1_key, p2_key, game_key)
    else:
        player_keys = Games.player_keyz()
        game_keys = Games.game_keys()
        p1_key = create_player_key()
        p2_key = create_player_key()
        game_key = create_game_key()
        keys_to_put = validate_keys(player_keys, game_keys, game_key, p1_key, p2_key)
        return keys_to_put
    
def valid_players(p1e, p2e, p1n, p2n):
    name_re = re.compile(r"^(?i)[a-z0-9_-]{1,20}$")
    if mail.is_email_valid(p1e) != True or mail.is_email_valid(p2e) != True:
        return False
    else:
        if not name_re.match(p1n) or not name_re.match(p2n):
            return False
    return True


def validate_keys(pk, gks, gk, p1k, p2k):
    while p1k in pk:
        p1k = create_player_key()
    while p2k in pk:
        p2k = create_player_key()
    while gk in gks:
        gk = create_game_key()
    return (p1k, p2k, gk)

def send_mailkeys(p1k, p1n, p2k, p2n, p1e, p2e):
    sender = 'anytime-go support <cyberkid108@gmail.com>'
    body = """
Hey %s,

    You have successfully started a Game of Go with %s. Here is your special game link! www.supersweetgo.appspot.com/%s
    %s will have a specific link for his/her game as well. It would be wise not to tell anyone this link
    because whoever has it will have access to your game. 

    Enjoy!

Sincerely,
Anytime-go Team.
""" 
    player1_info = (p1n, p2n.capitalize(), p1k, p2n.capitalize())
    player2_info = (p2n, p1n.capitalize(), p2k, p1n.capitalize())
    p1_body, p2_body = (body % player1_info, body % player2_info)

    mail.send_mail(sender=sender, 
                    to=p1e, 
                    subject=p1n + "'s" + " Game Link", 
                    body=p1_body)

    mail.send_mail(sender=sender, 
                    to=p2e,
                    subject = p1n + "'s" + " Game Link",
                    body=p2_body)

def init_and_dump_player(p1n, p2n, p1eml, p2eml):
    p1_key, p2_key, game_key = get_keys()
    send_mailkeys(p1_key, p1n, p2_key, p2n, p1eml, p2eml)
    Games.init_entity(p1n, p2n, p1eml, p2eml, p1_key, p2_key, game_key)

def delete_hoes():
    db.delete(Games.all())

class HomePage(MainHandler):
    def get(self):
        data = [[load_moves(g), load_game_info(g)] for g in Games.all()]
        self.render("home.html", data=data)

    def post(self):

        #check if incoming data is valid, if not render errors
        #if the data is valid, then we initialize a db entity for the incoming data
        #next we retrieve gameplay, p1, and p2 links for each game
        #then we create a random p1, p2, and gameplay key for the new game being created
        #then we check to make sure that those keys do not match any other keys in the db games
        #if we have uniques keys for our new game then we store the data in the db
        #finally we email the players their specific links for their game
        try:
            player_1name = self.request.get("player1_name")
            player_1email = self.request.get("p1_email")
            player_2name = self.request.get("player2_name")
            player_2email = self.request.get("p2_email")

            if valid_players(player_1email, player_2email, player_1name, player_2name):
                init_and_dump_player(player_1name, player_2name, player_1email, player_2email)
                self.write("Your game has successfully been created")
            else:
                self.write("something went wrong bro")

        except Exception as e:
            self.write("The server cannot process your request" + ' ' + str(e))

def get_current_player_info(game, address):
    game_info = load_game_info(game)
    if game_info['p1_key'] == address:
        return [1, 'black', game_info['p1_name'].capitalize()]
    elif game_info['p2_key'] == address:
        return [2, 'white', game_info['p2_name'].capitalize()]
def get_url_ind(l):
    index_double_slash = l.index('//')+2
    distance_to_add = len(l[:index_double_slash])
    next_part = l[index_double_slash:].index('/')+distance_to_add+1
    final = l[next_part:]
    return final

class PlayGame(MainHandler):
    def get(self):
        current_url = self.request.url
        link = get_url_ind(current_url)
        try:
            game = Games.by_link(link)
            player_data = get_current_player_info(game, link)
            if game != None:
                moves = load_moves(game)
                self.render('displayboard.html', 
                            move_history = moves, 
                            player_info = player_data)
        except Exception as e:
            self.write(str(e))
   
    def post(self):
        form_submitted = self.request.get("subm")
        if form_submitted == 'submit_move':
            opposing_colors = {'b':'w', 'w':'b'}
            new_moves = self.request.get("move_to_add_db")
            link = get_url_ind(self.request.url)
            game = Games.by_link(link)
            player_data = get_current_player_info(game, link)

            moves = load_moves(game)

            if new_moves != 'pass':
                new_moves = new_moves.split(',')
                moves.append(new_moves)
            else:
        #     #black will always start first
                if len(moves) == 0:
                    moves.append(['1', 'b', 'pass'])
                else:
                    last_move = moves[len(moves)-1]
                    turnIncremented = int(last_move[0]) + 1
                    color_of_passer = opposing_colors[last_move[1]]
                    moves.append([str(turnIncremented), color_of_passer, 'pass'])
    
            game.moves = pickle.dumps(moves)
            game.put()

            self.render("displayboard.html",
                    move_history = moves,
                    player_info = player_data,
                    )
        elif form_submitted == 'submit_ajax':
            link = get_url_ind(self.request.url)
            game = Games.by_link(link)
            length_of_moves = len(load_moves(game)) 
            output = json.dumps(length_of_moves)
            self.write(output)

app = webapp2.WSGIApplication([
    ('/', HomePage),
    (r'/[a-zA-Z0-9]+', PlayGame)
], debug=True)
