// BUILD YOUR SERVER HERE
const express = require('express');

const User = require('./users/model');

const server = express();
server.use(express.json());

server.post('/api/users', (req, res)=> {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    }else{
        User.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the user to the database',
                err: err.message,
                stack: err.stack,
            })
        })
    }
    
})

server.get('/api/users',(req, res)=> {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message,
                stack: err.stack,
            })
        })
    })

server.get('/api/users/:id',(req, res)=> {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message,
                stack: err.stack,
            })
        })
    })    

server.delete('/api/users/:id', async (req, res)=> {
    const findingUser = await User.findById(req.params.id);
    if(!findingUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    }else{
        const removal = await User.remove(req.params.id)
        .then(removal => {

            res.status(200).json(removal);
        })
    
   
        .catch(err => {
            res.status(500).json({
                message: 'The user could not be removed',
                err: err.message,
                stack: err.stack,
            })
        })
    }
    })

server.put('/api/users/:id', async (req,res)=> {
    try{
        const findingUser = await User.findById(req.params.id);
        if(!findingUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            if(!req.body.bio || !req.body.name){
                res.status(400).json({
                    message: "provide name and bio"
                })
            }else{
                const updatedUser = await User.update(req.params.id, req.body)
                res.status(200).json(updatedUser)
            }
    }} catch (err) {
        res.status(500).json({
            message: 'The user information could not be modified',
            err: err.message,
            stack: err.stack,
        })
    }
})

server.use('/api/users/:id',(req, res)=> {
    res.status(404).json({
        message: "The user with the specified ID does not exist"
    })
})

server.use('*',(req, res)=> {
    res.status(404).json({
        message: "not found"
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
