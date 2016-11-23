/**
 * nwjs 右键菜单组件模块
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import gui from 'nw.gui';

let singleInstance;

/**
 * 右键菜单组件类，单例类
 */
class Contextmenu extends Component {
    constructor(props) {
        super(props);

        if (singleInstance) {
            return singleInstance;
        }

        singleInstance = this;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        return null
    }

    createMenu(data) {
        if (this.dataCache == data) {
            return this;
        }

        var menu = new gui.Menu();

        data.forEach(item => {
            var menuItem = new gui.MenuItem(item);
            menu.append(menuItem);
        });
        this.menu = menu;
        this.dataCache = data;

        return this;
    }

    popup(x, y) {
        if (this.menu) {
            this.menu.popup(x, y);
        }
    }
}

export default Contextmenu