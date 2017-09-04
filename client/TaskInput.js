import React from 'react'
import axios from 'axios'

import { addTask, deleteAllTasks } from './endpoints'


export default class TaskInput extends React.Component {

    constructor(props) {
        super(props);

        this.onError  = this.props.onError || function(nothing){};
        this.onUpdateTasks = this.props.onUpdateTasks || function(nothing){};
    }

    onAddTask(ev) {
        ev.preventDefault();
        let datetime = new Date();
        let task = {
            task_name: this.taskInput.value,
        };

        axios({
            method: 'post',
            url: addTask,
            data: task,
            headers: {'X-CSRFToken': document.getElementsByTagName('base')[0].getAttribute('data-token')}
        }).then((res) => {
            let code = res.data.code;
            if (code === 201) {
                let tasks = [{
                    task_name: res.data.task.task_name,
                    task_id: res.data.task.task_id,
                    task_created_time: new Date(res.data.task.task_created_time).toLocaleString(),
                }];

                this.onUpdateTasks(tasks);
                this.taskInput.value = ""
            } else {
                this.onError(res.data.message);
            }
        })
    }

    onDeleteAllTasks(ev) {
        ev.preventDefault();
        axios.get(deleteAllTasks)
            .then(res => {
                let code = res.data.code;
                if(code === 200) {
                    this.onUpdateTasks([]);
                } else {
                    this.onError(res.data.message);
                }
            })
    }

    render() {
        return (
            <div>
                <input type="text" ref={n => this.taskInput = n}/>
                <button onClick={this.onAddTask.bind(this)}>Add</button>
                <button onClick={this.onDeleteAllTasks.bind(this)}>Delete all</button>
            </div>
        )
    }
}