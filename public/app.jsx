/** @jsx React.DOM */

var ColorBar = React.createClass({
  render: function() {
    var bars = _.chain(this.props.distribution)
      .pairs()
      .sortBy(function(pair) {
        return pair[1] * -1;
      })
      .map(function(pair) {
        var color = pair[0], count = pair[1];
        var style = {
          backgroundColor: "rgb(" + color + ")",
          flex: count
        };
        return <div key={color} style={style} />;
      });

    var style = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
    };

    return <div style={style}>{bars}</div>;
  }
});

var Application = React.createClass({
  propTypes: {
    colors: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      pokenum: 1,
      poketext: "1"
    };
  },

  render: function() {
    var style = {
      position: "relative",
      textAlign: "center",
      zIndex: 100,
    };

    return (
      <div>
        <div style={style}>
          <div>
            <img src={this.pokeImg()} width="160" height="160" />
          </div>
          <div>
            <input type="number" value={this.state.poketext} onChange={this.handleChange}
                   style={{fontSize: 20, width: 100, textAlign: "center"}}/>
          </div>
        </div>
        <ColorBar distribution={this.props.colors[this.state.pokenum - 1]} />
      </div>
    );
  },

  componentDidMount: function() {
    var hammer = new Hammer(this.getDOMNode(), {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL}]
      ]
    });
    hammer.on("swipeleft", function(e) {
      var num = this.state.pokenum;
      this.setNewValue(num + 1);
    }.bind(this));
    hammer.on("swiperight", function(e) {
      var num = this.state.pokenum;
      this.setNewValue(num - 1);
    }.bind(this));
  },

  handleChange: function(e) {
    this.setNewValue(e.target.value);
  },

  setNewValue: function(num) {
    this.setState({poketext: num});
    if (num && !isNaN(num)) {
      var numeric = parseInt(num, 10);
      if (numeric > 0 && numeric <= 493) {
        this.setState({pokenum: parseInt(num, 10)});
      }
    }
  },

  pokeImg: function() {
    return "images/poke_" + (this.state.pokenum - 1) + ".png";
  }
});

var xhr = new XMLHttpRequest();
xhr.open("GET", "meta.json");
xhr.onload = function(e) {
  var data = JSON.parse(this.response);
  React.renderComponent(<Application colors={data} />, document.getElementById("app"));
}
xhr.send();
