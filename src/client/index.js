/**
 * Application entry point
 */

// Load application styles
import './styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import View from './View';
import Model from './Model';
import Controller from './Controller';

const model = new Model([]);
const view = new View();

const controller = new Controller(model, view);

export default controller;
