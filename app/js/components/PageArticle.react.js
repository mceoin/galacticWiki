
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const React = require('react');
const parse = require('url-parse');
const Para = require('./Para.react');
const ToolTip = require('./ToolTip.react');

const PageArticle = React.createClass({

  propTypes:{
    page: React.PropTypes.object.isRequired,
    onUp: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
    }
  },

  render :function() {
  	const that = this;
  	const page = this.props.page;
    const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} className="favicon" />:null;
    const text = _.map(page.text, function(val, i){
        return <Para 
          key={i} 
          _key={i}
          onDown={that._onDown}
          onUp={that.props.onUp}
          text={val}
          tags={_.filter(page.links,{paragraphIndex:i})} />
    });

    const url = parse(page.canonicalLink, true);
    const prettyLink = url.host+url.pathname;

    var image;
    if ( page.imageCDN.url ){ // Create the image and set the height from the DB before we load it.
      const imgHeight = 700<page.imageCDN.dimensions[0]?
        700/page.imageCDN.dimensions[0]*page.imageCDN.dimensions[1]:
        page.imageCDN.dimensions[1];

      image = 
        <div className="page-img" style={{height:imgHeight}} >
          <img onError={this._imgError} src={page.imageCDN.url} style={{maxWidth:'100%'}} />
        </div>
    } else { // We dont have an image.
      image = 
        null
    }

    return <div className="row">
			<div className="page-main">
			  <div className="header">
			    <h1>{page.title}</h1>
			    <div className="page-link">
			      {favicon}
			      &nbsp;
			      <a href={page.canonicalLink} target="_blank">{prettyLink}</a>
			    </div>
			    <p style={{color:"#999", marginBottom:"24px"}}>{page.description}</p>
			    {image}
			  </div>
			  <div className="page-text">
			    {text}
			  </div>
			</div>
		</div>
  }

})

module.exports = PageArticle;