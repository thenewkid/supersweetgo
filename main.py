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
    gameplay_file_name = db.StringProperty(required=True)
    player1_link = db.StringProperty(required=True)
    player2_link = db.StringProperty(required=True)




    
class HomePage(MainHandler):
    def get(self):
        games = Games.all()
        self.render("home.html", games=games)
    def post(self):
        #create xml file
        #update the xml file with the form data
        #store the flename in the database along with the game being made
        #redirect to displayboard
        d = 'abcdefghijklmnopqrstuvwxyz123456789'
        games = Games.all()
        total_links = []
        total_gameplay_keys = []
        for game in games:
            link = game.gameplay_file_name
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

        gameplay_temp_file_name = "".join([d[random.randrange(0, len(d))] for x in range(20)]) + ".xml"

        while gameplay_temp_file_name in total_gameplay_keys:
            gameplay_temp_file_name = "".join([d[random.randrange(0, len(d))] for x in range(20)]) + ".xml"

        new_game = Games(
                        player1_name = self.request.get('player1_name'),
                        player2_name = self.request.get('player2_name'),
                        player1_color = self.request.get('p1_color'),
                        player2_color = self.request.get('p2_color'),
                        player1_email = self.request.get('p1_email'),
                        player2_email = self.request.get('p2_email'),
                        player1_link = player1_key,
                        player2_link = player2_key,
                        gameplay_file_name = gameplay_temp_file_name
                    )
        new_game.put()

        self.write("Thanks a game wil be started soon")

        # new_gameplay_file = open('')
        # width = self.request.get('w')
        # height = self.request.get('h')
        # self.redirect('/displayboard')

            

class DisplayBoard(MainHandler):
    def get(self):

        try:
            gmplay_obj = minidom.parse('gameplayFiles\\test.xml')
            #jsonny = json.loads(gmplay_obj.toprettyxml())
            #dim = gmplay_obj.getElementsByTagName("dimension")
            # dim_val = dim[0].firstChild.data
            moves = gmplay_obj.getElementsByTagName('move')
            move_history = []
            for move in moves:
                move_history.append([move.getAttribute('turn'), 
                    move.getAttribute('color'), 
                    move.getAttribute('x'),
                     move.getAttribute('y')])

            #     self.write(move.getAttribute("color")+",")
            #xml = gmplay_obj.toprettyxml()
            #self.write(dimension)
            #dim = dom.getElementsByTagName('dimension')[0].data
            #moves = dom.getElementsByTagName('move')
            #self.write(dim)
            self.render('displayboard.html', move_history = move_history)
        except Exception as e:
            self.write("request cnanot be processed"+ str(e))
    # draw the board



    # render the html page
            
app = webapp2.WSGIApplication([
    ('/', HomePage),
    ('/displayboard', DisplayBoard)
], debug=True)
