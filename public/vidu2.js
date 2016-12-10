var ClickButton = React.createClass(
  {
      add(){
        this.setState({num: ++this.state.num});
      },
      getInitialState(){
        return {num: 0};
      },
      render(){
        var a = this.props.children;
        var num = this.state.num;
        console.log('RUN');
        var c = <a href="http://khoapham.vn">KhoaPham</a>
        var mang = [
          <p>sadfasf</p>,
          <p>324523</p>,
          <p>sadfdadf2asf</p>,
          <p>vcbvdfsdf</p>
        ]
        return (
          <div>
            <p>{this.props.start}</p>
            <p>{a}</p>
            <p>{a}</p>
            {c}
            {mang}
            <button onClick={this.add}>{num}</button>
          </div>
        )
      }
  }
);

ReactDOM.render(<ClickButton start="khoaPham">ABCD</ClickButton>, document.getElementById('root'));
