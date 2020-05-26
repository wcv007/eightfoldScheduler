import React, { Component } from "react";
import Scheduler from "./components/Scheduler";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import "./App.css";

const data = {
  Varun: [
    {
      start_date: "2020-06-10 6:00",
      end_date: "2020-06-10 8:00",
      text: "Event 1",
      id: 1,
    },
    {
      start_date: "2020-06-13 10:00",
      end_date: "2020-06-13 18:00",
      text: "Event 2",
      id: 2,
    },
  ],
  Rajat: [
    {
      start_date: "2020-04-29 6:00",
      end_date: "2020-04-29 8:00",
      text: "Event 3",
      id: 3,
    },
    {
      start_date: "2020-05-13 10:00",
      end_date: "2020-05-13 18:00",
      text: "Event 4",
      id: 4,
    },
  ],
  Sachin: [
    {
      start_date: "2020-04-29 6:00",
      end_date: "2020-04-29 8:00",
      text: "Event 5",
      id: 5,
    },
    {
      start_date: "2020-05-13 10:00",
      end_date: "2020-05-13 18:00",
      text: "Event 6",
      id: 6,
    },
  ],
  Rohit: [
    {
      start_date: "2020-05-29 16:00",
      end_date: "2020-05-29 18:00",
      text: "Event 7",
      id: 7,
    },
    {
      start_date: "2020-06-01 10:00",
      end_date: "2020-06-01 18:00",
      text: "Event 8",
      id: 8,
    },
  ],
  Chanchal: [
    {
      start_date: "2020-05-21 16:00",
      end_date: "2020-05-21 18:00",
      text: "Event 9",
      id: 9,
    },
    {
      start_date: "2020-06-01 10:00",
      end_date: "2020-06-01 18:00",
      text: "Event 10",
      id: 10,
    },
  ],
};

function checkConflict(event, data) {
  for (let i = 0; i < data.length; i++) {
    let st = data[i].start_date;
    let en = data[i].end_date;
    if (
      (event.start_date > st && event.start_date < en) ||
      (event.end_date > st && event.end_date < en) ||
      (event.start_date <= st && event.end_date >= en)
    ) {
      if (event.id !== data[i].id) {
        return true;
      }
    }
  }
  return false;
}

function removeData(data, id) {
  for (let i = 0; i < data.length; i++) {
    if (id == data[i].id) {
      data.splice(i, 1);
    }
  }
}

class App extends Component {
  constructor() {
    super(...arguments);
    let storedData = localStorage.getItem("dat")
      ? JSON.parse(localStorage.getItem("dat"))
      : null;
    this.state = {
      currentTimeFormatState: true,
      messages: [],
      selectValue: null,
      data: storedData || null,
      conflict: false,
    };
  }

  addMessage(message, timeout) {
    const maxLogLength = 5;
    const newMessage = { message };
    const messages = [newMessage, ...this.state.messages];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (action, ev, id) => {
    const text = ev && ev.text ? ` (${ev.text})` : "";
    const message = `event ${action}: ${id} ${text}`;
    this.addMessage(message, 5000);
    let id1 = document.getElementById("selectUser").value;
    if (action === "create" || action === "update") {
      if (!data.hasOwnProperty(id1)) {
        data[id1] = [];
      }
      let flag = checkConflict(ev, data[id1]);
      if (flag) {
        this.setState({ conflict: true });
        this.addMessage(
          `Warning : Event ${ev.text} is conflicting with an existing event. `
        );
        // also alert can be shown
        alert(
          `Warning : Event ${ev.text} is conflicting with an existing event. `
        );
      }
      data[id1].push(ev);
      this.setState({ data: data[id1] });
    }
    if (action === "delete") {
      removeData(data[id1], ev.id);
    }
  };

  handleTimeFormatStateChange = (state) => {
    this.setState({
      currentTimeFormatState: state,
    });
  };

  handleChange = (e) => {
    this.setState({ selectValue: e.target.value });
    this.setState({ data: data[e.target.value] });
  };

  componentDidMount() {
    let id = document.getElementById("selectUser").value;
    this.setState({ data: data[id] });
  }

  saveData = () => {
    localStorage.setItem("dat", JSON.stringify(data));
  };
  render() {
    const { currentTimeFormatState, messages, selectValue, data } = this.state;
    return (
      <div className="topDiv">
        <div className="dropDownDiv">
          <span className="spanText">Select User: </span>
          <select
            value={selectValue}
            onChange={this.handleChange}
            className="dropdown"
            id="selectUser"
          >
            <option value="Sachin">Sachin</option>
            <option value="Varun">Varun</option>
            <option value="Rajat">Rajat</option>
            <option value="Rohit">Rohit</option>
            <option value="Chanchal">Chanchal</option>
          </select>
        </div>
        <div className="SchedulerDiv">
          <div className="tool-bar">
            <Toolbar
              timeFormatState={currentTimeFormatState}
              onTimeFormatStateChange={this.handleTimeFormatStateChange}
            />
          </div>
          <button className="saveData" onClick={this.saveData}>
            Save Data
          </button>
          <div className="scheduler-container">
            <Scheduler
              events={data}
              timeFormatState={currentTimeFormatState}
              onDataUpdated={this.logDataUpdate}
            />
          </div>
          <MessageArea messages={messages} />
        </div>
      </div>
    );
  }
}
export default App;
