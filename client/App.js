import React from 'react'
import axios from 'axios'

import Task from './Task'
import TaskInput from './TaskInput'
import { listTasks } from './endpoints'


const ADD_TASK        = 1;
const DELETE_TASK     = 2;
const ADD_ALL_TASKS   = 3;
const DELETE_ALL_TASK = 4;


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { tasks: [] }
    }

    componentWillMount() {
        axios.get(listTasks)
            .then((res) => {
            let code = res.data.code;
            if(code === 200) {
                this.onUpdateTasks(res.data.tasks, ADD_ALL_TASKS);
            }
        })
    }

    onError(message) {
        alert(message);
    }

    onUpdateTasks(data, updateType = ADD_TASK) {
        let tasks = [];
        switch (updateType) {
            case ADD_TASK:
                tasks.push(...data);
                tasks.push(...this.state.tasks);
                break;
            case DELETE_ALL_TASK:
                tasks = data;
                break;
            case ADD_ALL_TASKS:
                tasks = data.map(el => {
                    return {
                        task_name: el.task_name,
                        task_id: el.task_id,
                        task_end_time: new Date(el.task_end_time).toLocaleString(),
                        task_created_time: new Date(el.task_created_time).toLocaleString(),
                    }
                });
                break;

            case DELETE_TASK:
                tasks = this.state.tasks.filter(el => {
                    return el.task_id !== data.task_id;
                });

                break;
        }

        this.setState({tasks: tasks});
    }

    render() {
        return (
            <div>
                <div>
                    <TaskInput onError={this.onError}
                               onUpdateTasks={tasks => {
                                   this.onUpdateTasks(tasks, tasks.length >= 1? ADD_TASK: DELETE_ALL_TASK) }
                               } />
                </div>
                <div>
                    {
                        this.state.tasks.length === 0?
                            <div><p>There's No Tasks</p></div>:
                            this.state.tasks.map((el) => {
                                return <Task key={el.task_id} task={el}
                                             onError={this.onError}
                                             onUpdateTasks={task => {this.onUpdateTasks(task, DELETE_TASK)}} />
                            })
                    }
                </div>
               </div>
        )
    }
}
