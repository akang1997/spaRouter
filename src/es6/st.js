import Loader from './Loader'
import Route from './Route'

import Sence from './Sence'
import SenceConfManager from './SenceConfManager'

import observable from './observable'

import Statge from './Statge'
import StatgeManager from './StatgeManager'

import ui from './ui'
import util from './util'


var st = {
    Loader : Loader
    ,Route : Route
    ,observable : observable
    ,Statge : Statge
    ,util : util
}

$.extend(st, SenceConfManager, StatgeManager, ui, Sence);


window.st = st;