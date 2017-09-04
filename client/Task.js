import React from 'react'
import axios from 'axios'

import {
    deleteTask,
    updateTaskName
} from './endpoints'


export default class Task extends React.Component {

    constructor(props) {
        super(props);

        this.onError  = this.props.onError || function(nothing){};
        this.onUpdateTasks = this.props.onUpdateTasks || function(nothing){};
        this.state = {updateTaskName: false, task_name: this.props.task.task_name, old_task_name: this.props.task.task_name};
    }

    onDeleteTask(ev) {
        ev.preventDefault();
        const task = this.props.task;
        axios.get(deleteTask, {
            params: {
                task_id: task.task_id,
            }
        }).then((res) => {
            let code = res.data.code;
            if(code === 200) {
                let task = res.data.task;
                this.onUpdateTasks(task);
            } else {
                this.onError(res.data.message);
            }
        })
    }

    onUpdateTaskName(task_id, task_end_time, new_task_name) {
        axios({
            method: 'put',
            url: updateTaskName,
            data: { task_id: task_id, task_name: new_task_name, task_end_time: task_end_time },
            headers: {'X-CSRFToken': document.getElementsByTagName('base')[0].getAttribute('data-token')}
        }).then((res) => {
            let code = res.data.code;
            if(code === 202) {
                this.setState({
                    updateTaskName: false,
                    task_name: new_task_name,
                    old_task_name: new_task_name
                });
            } else {
                this.setState({ updateTaskName: false, task_name: this.state.old_task_name, old_task_name: this.state.old_task_name });
            }
        }).catch(err => {
            this.setState({ updateTaskName: false, task_name: this.state.old_task_name, old_task_name: this.state.old_task_name });
        })
    }

    render() {
        const task = this.props.task;
        return (
            <div>
                {
                    !this.state.updateTaskName?
                        <div>
                            <p onClick={(ev) => {
                                ev.preventDefault();
                                this.setState({updateTaskName: true})
                            }}>{this.state.task_name || task.task_name}</p>
                            <p>Created: {task.task_created_time}</p>
                        </div>:
                        <div>
                            <input type="text" value={this.state.task_name}
                                    onChange={e => this.setState({task_name: e.target.value})}/>

                            <button onClick={ev => {
                                ev.preventDefault();
                                this.onUpdateTaskName(task.task_id, task.task_end_time, this.state.task_name);
                            }}>save</button>

                            <button onClick={ev => {
                                ev.preventDefault();
                                this.setState({
                                    updateTaskName: false,
                                    task_name: this.state.old_task_name,
                                    old_task_name: this.state.old_task_name
                                });
                            }}>no save</button>
                        </div>
                }
                {
                    !this.state.updateTaskName?
                        <button onClick={this.onDeleteTask.bind(this)}>delete</button>
                        : null
                }
            </div>
        )
    }
}