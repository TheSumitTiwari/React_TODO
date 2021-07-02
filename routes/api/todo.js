const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("config");
const bcrypt = require("bcryptjs");
const passportJWT = passport.authenticate("jwt", { session: false });
const passportLocal = passport.authenticate("local", { session: false });
const { check, validationResult } = require("express-validator/check");
const Todo = require("../../models/Todo");

router.get("/secret", passportJWT, (req, res) => {
    console.log(req.user);
    res.json(req.user);
  });

router.post(
  "/add",
  //for user varification
  passportJWT,
  // For Input Validation with express validator
  [
    check("task", "Task is required").not().isEmpty(),
    
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { task, description } = req.body;
    const userId = req.user.email;
    try {
        //adding new todo
        const todo = new Todo({
            userId,
            task, 
            description
        });
 
        todo.save((err, added) => {
            if(err){
              res.status(500).json({ errors: [{ msg: err.message }] });
            }else{
              console.log(added)
              res.status(200).json(added);
            }
          });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "server error" }] });
    }
  }
);

router.get("/todos", passportJWT, (req, res) => {
  modules = Todo.find({userId:req.user.email},(err, request) => {
      if(err){
        res.status(400).json({ errors: [{ msg: err.message }] });
      }else{
          var todoArr = [];
          request.map(function (item) {
            todoArr.push(item);
          });
          todoArr = todoArr.reverse();
          res.status(200).json({
            todoArr,
          });
      }
  });
});


router.delete(
    "/delete/:id",
    //for user varification
    passportJWT,
    // For Input Validation with express validator
    async (req, res) => {
      const userId = req.user.email;
      try {
            await Todo.findOneAndDelete({userId: userId, _id: req.params.id}, (err, deleted) => {
              if(err){
                res.status(500).json({ errors: [{ msg: err.message }] });
              }else{
                console.log(deleted);
                res.status(200).json(`Todo succesfully deleted`);
              }
            });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "server error" }] });
      }
    }
  );


router.put(
    "/update/:id",
    //for user varification
    passportJWT,
    // For Input Validation with express validator
    async (req, res) => {
      const userId = req.user.email;
      const update = {task: req.body.task, description: req.body.description}
      console.log(update)
      try {
        await Todo.findOneAndUpdate({userId: userId, _id: req.params.id},update, (err, updated) => {
          if(err){
            res.status(500).json({ errors: [{ msg: err.message }] });
          }else{
            console.log("1111111111",updated);
            res.status(200).json(`Todo succesfully Updated`);
          }
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "server error" }] });
      }
    }
  );

router.put(
    "/stared",
    //for user varification
    passportJWT,
    
    async (req, res) => {
      const { todoId } = req.body;
      console.log(todoId);
      const userId = req.user.email;
      const todo = await Todo.findOne({userId: userId, _id: todoId},(err, todo)=>{
        if(err){
          res.status(500).json({ errors: [{ msg: err.message }] });
        }
      })
      try {
          if(todo.stared){
              const update = {stared:false};
              await Todo.findOneAndUpdate({userId: userId, _id: todoId}, update, (err, updated) => {
                if(err){
                  res.status(500).json({ errors: [{ msg: err.message }] });
                }else{
                  res.status(200).json(false);
                }
              });
          }else{
            const update = {stared:true};
            await Todo.findOneAndUpdate({userId: userId, _id: todoId}, update, (err, updated) => {
              if(err){
                res.status(500).json({ errors: [{ msg: err.message }] });
              }else{
                res.status(200).json(true);
              }
            });
          }
      } 
      catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "server error" }] });
      }
    }
  );

  router.put(
    "/completed",
    passportJWT,
  
    async (req, res) => {
      const { todoId } = req.body;
      const userId = req.user.email;
      const todo = await Todo.findOne({userId: userId, _id: todoId})
      try {
          if(todo.completed){
              const update = {completed:false};
              await Todo.findOneAndUpdate({userId: userId, _id: todoId}, update, (err, updated) => {
                if(err){
                  res.status(500).json({ errors: [{ msg: err.message }] });
                }else{
                  console.log("-----------",updated);
                  res.status(200).json(false);
                }
              });
          }else{
            const update = {completed:true};
              await Todo.findOneAndUpdate({userId: userId, _id: todoId}, update, (err, updated) => {
                if(err){
                  res.status(500).json({ errors: [{ msg: err.message }] });
                }else{
                  console.log("--------",updated);
                  res.status(200).json(true);
                }
              });
          }
      } 
      catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "server error" }] });
      }
    }
  );

  
module.exports = router;