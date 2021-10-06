const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const router = express.Router();
const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
const contactsOperation = require("../../model/index");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contactsOperation.getContacts();
    
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await contactsOperation.getContactById(contactId);

    if (!contactById) {
      throw new NotFound(`Contact with id = ${contactId} not found`);
      // const error = new Error(`Contact with id = ${contactId} not found`);
      // error.status = 404;
      // throw error;

      // res.status(404).json({
      //   status: "error",
      //   code: 404,
      //   message: `Contact with id = ${contactId} not found`,
      // });
      // return;
    }

    res.json(contactById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const newContact = await contactsOperation.addContact(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        newContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { body } = req;
    const { contactId } = req.params;
    const { error } = joiSchema.validate(body);

    if (error) {
      throw new BadRequest(error.message);
    }
    const updatedContact = await contactsOperation.updateContact(
      contactId,
      body
    );
    if (!updatedContact) {
      throw new NotFound(`Contact with id = ${contactId} not found`);
    }

    res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const removeContact = await contactsOperation.removeContact(contactId);
    if (!removeContact) {
      throw new NotFound(`Contact with id = ${contactId} not found`);
    }
    
    res.json({
      status: "success",
      code: 200,
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
