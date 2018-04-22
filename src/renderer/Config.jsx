import React, { Component } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want

const SortableItem = SortableElement(({ idx, onRemove, value }) => (
  <li>
    <DragHandle />
    {value}
    <span onClick={() => onRemove(idx)}>Remove {idx}</span>
  </li>
));

const SortableList = SortableContainer(({ items, onRemove }) => {
  return (
    <ol>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          idx={index}
          value={value.name}
          onRemove={onRemove}
        />
      ))}
    </ol>
  );
});

class Config extends Component {
  constructor() {
    super();
    const dictionaries = JSON.parse(localStorage.getItem('dictionaries'));
    this.state = {
      items: dictionaries,
      newName: '',
      newURL: '',
    };
    this.handleBackClick = this.handleBackClick.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const newOrder = arrayMove(this.state.items, oldIndex, newIndex);
    this.setState({
      items: newOrder,
    });
    console.log(newOrder);
    localStorage.setItem('dictionaries', JSON.stringify(newOrder));
  }

  handleBackClick() {
    this.props.router.push('/dic');
  }

  handleAddClick(event) {
    const items = this.state.items;
    items.push({ name: this.state.newName, url: this.state.newURL });
    this.setState({ items: items });
    localStorage.setItem('dictionaries', JSON.stringify(items));
    event.preventDefault();
  }

  handleNameChange(event) {
    this.setState({ newName: event.target.value });
  }

  handleURLChange(event) {
    this.setState({ newURL: event.target.value });
  }

  handleRemoveClick(index) {
    const items = this.state.items;
    items.splice(index, 1);
    console.log('check:', items);
    this.setState({ items: items });
    localStorage.setItem('dictionaries', JSON.stringify(items));
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <header className="toolbar toolbar-header">
          <h1 className="title">Config</h1>
          <div className="toolbar-actions">
            <button className="btn btn-default" onClick={this.handleBackClick}>
              <span className="icon icon-back" />
              <span>Back to Dictionary</span>
            </button>
          </div>
        </header>

        <div className="window-content">
          <div>
            <SortableList
              items={this.state.items}
              onSortEnd={this.onSortEnd}
              onRemove={this.handleRemoveClick}
              useDragHandle={true}
            />

            <form>
              <div className="form-group">
                <label>Dictionary Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dictionary Name"
                  value={this.state.newName}
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="form-group">
                <label>Dictionary URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dictionary URL"
                  value={this.state.newURL}
                  onChange={this.handleURLChange}
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-form btn-default"
                  onClick={this.handleAddClick}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Config;
