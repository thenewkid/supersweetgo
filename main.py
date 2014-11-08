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
from xml.dom import minidom
import json


template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), 
	autoescape = True)

def check_validity(w, h, p1n, p2n, p1c, p2c):
    errors = {}
    if not (w >= 4 and w <= 19):
        errors['width_err'] = "Width Must Be Between 4 and 19"
    if not (h >= 4 and h <= 19):
        errors['height_err'] = "Height Must Between 4 and 19"
    if p1n.isdigit():
        errors['p1n_err'] = "Names Must Contain At Least One Character"
    if p2n.isdigit():
        errors['p2n_err'] = "Names Must Contain At Least One Character"
    if p1c == p2c:
        errors['color_err'] = "Colors Can't Be Equal"

    if len(errors):
        return errors
    else:
        return True
class MainHandler(webapp2.RequestHandler):
    def write(self, *args, **kwargs):
        self.response.out.write(*args, **kwargs)
        
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kwargs):
        self.write(self.render_str(template, **kwargs))
class HomePage(MainHandler):
    def get(self):
        try:
            self.render("home.html")
        except Exception:
            self.write("Request cannot be processed")
    def post(self):
        try:
            width = int(self.request.get("w"))
            height = int(self.request.get("h"))
            p1_name = self.request.get("player1_name")
            p2_name = self.request.get("player2_name")
            p1c = self.request.get("player1C")
            p2c = self.request.get("player2C")
            true_data = check_validity(width, height, p1_name, p2_name, p1c, p2c)
            if type(true_data) != dict:
                self.render("game.html", w=width, h=height, p1n=p1_name, p2n=p2_name, p1c=p1c, p2c=p2c)
            elif type(true_data) == dict:
                self.render("home.html", **true_data)
        except Exception as e:
            self.write("Form request cannot be processed")

class DisplayBoard(MainHandler):
    def get(self):
        try:



            gmplay_obj = minidom.parse('gameplayFiles\\test.xml')
            dim = gmplay_obj.getElementsByTagName("dimension")
            dim_val = dim[0].firstChild.data
            moves = gmplay_obj.getElementsByTagName('move')
            for move in moves:
                self.write(move.getAttribute("color")+",")



            self.write(dimension)

            #dim = dom.getElementsByTagName('dimension')[0].data
            #moves = dom.getElementsByTagName('move')
            #self.write(dim)


            self.render('displayboard.html', dim=type(dimension))
        except Exception as e:
            self.write("request cnanot be processed"+ str(e))
    # draw the board



    # render the html page
            
app = webapp2.WSGIApplication([
    ('/', HomePage),
    ('/displayboard', DisplayBoard)
], debug=True)
