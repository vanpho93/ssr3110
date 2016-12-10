var that;

socket.on('SERVER_SEND_DATA_FIRST_TIME', data => {
  that.state.mang = data;
  that.setState(that.state);
});

socket.on('SERVER_CONFIRM_DELETE', data => {
  if(data.result == 1){
    var removeIndex = that.state.mang.findIndex(e => e.id == data.index);
    that.state.mang.splice(removeIndex, 1);
    that.setState(that.state);
  }
});

socket.on('SERVER_ACCEPT_NOTE', row => {
  that.state.mang.push(row);
  that.setState(that.state);
});

socket.on('SERVER_ACCEPT_UPDATE', note => {
  var obj = that.state.mang.find(e => e.id == note.id);
  obj.note = note.value;
  that.setState(that.state);
});


var Note = React.createClass({
  getInitialState(){
    return {isUpdating: false};
  },
  remove(){
    socket.emit('DELETE_NOTE', this.props.id);
  },
  cancel(){
    this.state.isUpdating = false;
    this.setState(this.state);
  },
  save(){
    var {id} = this.props;
    var {value} = this.refs.txt;

    socket.emit('CLIENT_UPDATE_NOTE', {id,value});
    this.refs.txt.value = '';
    this.state.isUpdating = false;
    this.setState(this.state);
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
  }
});

var NoteForm = React.createClass({
  add(){
    socket.emit('CLIENT_ADD_NOTE', this.refs.txt.value);
    this.refs.txt.value = '';
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
