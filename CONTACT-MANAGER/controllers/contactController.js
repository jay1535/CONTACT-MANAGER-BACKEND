const asyncHandler = require("express-async-handler")
const Contact = require('../models/contactModel')
//@desc Get all contacts
//@Route Get /api/contacts
//@access private

const getContacts = asyncHandler (async (req,res)=>{
    const contacts = await Contact.find({
        user_id: req.user.id
    })
    res.status(200).json(contacts)
})
//@desc Create new contacts
//@Route Post /api/contacts
//@access private

const createContact =asyncHandler( async (req,res)=>{
    console.log(req.body)
    const {name, email,phone} = req.body;
    if(!name|| !email||!phone){
        res.status(400);
        throw new Error("All fields are mandetory!!")
    }
    const contact = await Contact.create({
        name,
        email, 
        phone,
        user_id : req.user.id
    })
    res.status(201).json(contact)
})

//@desc get new contacts
//@Route get /api/contacts/id
//@access private

const getContact =asyncHandler (async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
})
//@desc Update  contacts
//@Route put /api/contacts
//@access private

const updateContact = asyncHandler (async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user_id.toSting() !== req.user.id){
        res.status(403);
        throw new Error("You can only update your own contact")
    }
   const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new :true}

   )
   res.status(200).json(updatedContact)

})
//@desc delete  contacts
//@Route delete /api/contacts
//@access private

const deleteContact =asyncHandler (async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user_id.toSting() !== req.user.id){
        res.status(403);
        throw new Error("You can only delete your own contact")
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contact)
}
)
module.exports = {getContacts,createContact,getContact,updateContact,deleteContact}
