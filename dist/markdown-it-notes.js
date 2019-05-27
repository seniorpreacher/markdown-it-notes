/*! markdown-it-notes 0.0.2 https://github.com//seniorpreacher/markdown-it-notes @license ISC */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitNotes = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const notePlugin = (md, options) => {
    const tokenNesting = {
        OPEN: 1,
        CLOSE: -1,
        SELF_CLOSING: 0,
    };

    const createTokens = (noteIcon, label, Token, options) => {
        const nodes = [];
        let token;
        const iconClassList = [...(options.iconClassList || []), noteIcon].join(' ');

        token = new Token('note_icon_open', 'i', tokenNesting.OPEN);
        token.attrs = [['class', iconClassList]];
        nodes.push(token);

        nodes.push(new Token('note_icon_close', 'i', tokenNesting.CLOSE));

        token = new Token('text', '', tokenNesting.SELF_CLOSING);
        token.content = label;
        nodes.push(token);

        return nodes;
    };


    const splitTextToken = (original, Token, options) => {
        const content = original.content.trimLeft();
        if (content.length < 2) {
            return original;
        }
        const noteTypes = options.noteTypes || {};
        const noteTypesKeys = Object.getOwnPropertyNames(noteTypes);
        const currentNoteType = noteTypesKeys.find((noteType) => content.startsWith(noteType));
        if (!currentNoteType) {
            return original;
        }
        const label = ' ' + content.substr(currentNoteType.length).trimLeft();
        return createTokens(noteTypes[currentNoteType], label, Token, options);
    };

    const inlineNote = (state, options) => {
        options = options || {};

        return state.tokens
            .filter((block) => block.type === 'inline')
            .forEach((block) => {
                for (let i = block.children.length - 1; i >= 0; i--) {
                    const token = splitTextToken(block.children[i], state.Token, options);
                    block.children = state.md.utils.arrayReplaceAt(block.children, i, token);
                }
            });
    };

    md.core.ruler.push('inline_note', (state) => inlineNote(state, options));
};


module.exports = notePlugin;

},{}]},{},[1])(1)
});
