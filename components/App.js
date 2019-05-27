var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "lARHjRkPSinmJsj85Df4h975urc9yoGR";

App = React.createClass({
    
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1.
        this.setState({
          loading: true  // 2.
        });

        this.getGif(searchingText)
          .then(gif => {
            this.setState({  // 4
              loading: false,  // a
              gif: gif,  // b
              searchingText: searchingText  // c
            });
          })
          .catch(e => console.error(e));
      },

      getGif: function(searchingText) {
        return new Promise(function(resolve, reject) { 
              var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
              var xhr = new XMLHttpRequest();   

              xhr.onload = function() {
                if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText).data;
                  
                  resolve({
                    url: data.images.fixed_height_downsampled.url,
                    sourceUrl: data.url
                  });               
                } else {
                  reject(new Error(this.statusText));
                }
              };

              xhr.onerror = function() {
                reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
              };

              xhr.open('GET', url);
              xhr.send();
            });
      },
    
    render: function() {

      var styles = {
          margin: '0 auto',
          textAlign: 'center',
          width: '90%'
      };

      return (
        <div style={styles}>
              <h1>Wyszukiwarka GIFow!</h1>
              <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
              <Search onSearch={this.handleSearch.bind(this)}/>
              <Gif
                  loading={this.state.loading}
                  url={this.state.gif.url}
                  sourceUrl={this.state.gif.sourceUrl}
              />
        </div>
      );
  }

});