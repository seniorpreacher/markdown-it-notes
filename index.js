'use strict';

const notePlugin = (md, options) => {
    const tokenNesting = {
        OPEN: 1,
        CLOSE: -1,
        SELF_CLOSING: 0
    };

    const createTokens = function (noteIcon, label, Token, options) {
        let nodes = [];
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
        const currentNoteType = noteTypesKeys.find(noteType => content.startsWith(noteType));
        if (!currentNoteType) {
            return original;
        }
        const label = ' ' + content.substr(currentNoteType.length).trimLeft();
        return createTokens(noteTypes[currentNoteType], label, Token, options);
    };

    const inlineNote = (state, options) => {
        options = options || {};

        return state.tokens
            .filter(block => block.type === 'inline')
            .forEach(block => {
                for (let i = block.children.length - 1; i >= 0; i--) {
                    const token = splitTextToken(block.children[i], state.Token, options);
                    block.children = state.md.utils.arrayReplaceAt(block.children, i, token);
                }
            });
    };

    md.core.ruler.push('inline_note', state => inlineNote(state, options));
};


module.exports = notePlugin;
