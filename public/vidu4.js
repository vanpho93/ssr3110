var that;
var Note = React.createClass({
  getInitialState(){
    return {isUpdating: false};
  },
  remove(){
    $.get(`/api/delete/${this.props.id}`, data => {
      if(data == 1){
        var removeId = that.state.mang.findIndex(e => this.props.id==e.id);
        that.state.mang.splice(removeId, 1);
        that.setState(that.state);
      }
    });
  },
  cancel(){
    this.state.isUpdating = false;
    this.setState(this.state);
  },
  save(){
    var {id} = this.props;
    var {value} = this.refs.txt;
    $.get(`/api/update/${id}/${value}`, data => {
      if(data == 1){
        var updateId = that.state.mang.findIndex(e => this.props.id==e.id);
        that.state.mang[updateId].note = value;
        that.setState(that.state);

        this.state.isUpdating = false;
        this.setState(this.state);
      }
    });
  },
  update(){
    this.state.isUpdating = true;
    this.setState(this.state);
  },
  render(){
    var {children, id} = this.props;
    if(this.state.isUpdating){
      return(
        <div>
          <input type="text" ref="txt" defaultValue={children}/>
          <br/><br/>
          <button onClick={this.save}>Luu</button>
          <button onClick={this.cancel}>Huy</button>
        </div>
      );
    }else{
      return (
        <div>
          <p>{children}</p>
          <button onClick={this.remove}>Xoa</button>
          <button onClick={this.update}>Sua</button>
        </div>
      );
    }
  }
});

var List = React.createClass({
  getInitialState(){
    that = this;
    return {mang: []}
  },
  render(){
    var {mang} = this.state;
    return (
      <div>
        <NoteForm/>
        {
          mang.map(e => <Note key={e.id} id={e.id}>{e.note}</Note>)
        }
      </div>
    );
  },
  componentDidMount(){
    $.get('/api/getNote', data => {
      this.state.mang = data;
      this.setState(this.state);
    });
  }
});

var NoteForm = React.createClass({
  add(){
    $.get(`/api/insert/${this.refs.txt.value}`, data => {
      that.state.mang.unshift(data);
      that.setState(that.state);
      this.refs.txt.value = '';
    });
  },
  render(){
    return (
      <div>
        <input type="text" ref="txt" placeholder="Enter your note"/>
        <br/><br/>
        <button onClick={this.add}>Them</button>
      </div>
    );
  }
});

ReactDOM.render(<List/>, document.getElementById('root'));
