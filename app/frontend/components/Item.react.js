/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');

var divStyle = {
    width: "25px;",
    height: "25px;",
    background: "red;",
    "-moz-border-radius": "50px / 50px;",
    "-webkit-border-radius": "50px / 50px;",
    "border-radius": "50px / 50px;",
    "position":"absolute",
    "right":"-30px"
};
var parent = {
    "position":"relative"
}

var Item = React.createClass({
    displayName : 'Item',
    propTypes: {
        title: ReactPropTypes.string.isRequired,
        text: ReactPropTypes.string.isRequired
    },
    mixins : [],
    getInitialState : function() {
    	return {};
    },
    componentWillMount : function() {},
    componentWillUnmount : function() {},
    render : function() {

        var paragraphs = _.map(this.props.text, function(textItem){
            return (<div style={parent}>
                    <div style={divStyle}></div>
                    <p>{textItem}</p>

                </div>)
        });
    	var item =  (
            <div>
        		<div>{this.props.title}</div>
                <hr />
                {paragraphs}
            </div>
    		)
    	return item;
    }
});
module.exports = Item;
