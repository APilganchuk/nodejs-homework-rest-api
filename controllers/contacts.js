const { NotFound, BadRequest } = require("http-errors");

const { joiSchema } = require("../models/contact");

const { Contact } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const allContacts = await Contact.find({}, "_id name email phone favorite");

    res.json({
      status: "success",
      code: 200,
      data: {
        allContacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findById(
      contactId,
      "_id name email phone favorite"
    );
    // const contactById = await Contact.findOne({ _id: contactId });

    if (!contactById) {
      throw new NotFound(`Contact with id = ${contactId} not found`);
      // const error = new Error(`Contact with id = ${contactId} not found`);
      // error.status = 404;
      // throw error;
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        contactById,
      },
    });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const newContact = await Contact.create(req.body);

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
};

const updateById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;
    const { error } = joiSchema.validate(body);

    if (error) {
      throw new BadRequest(error.message);
    }
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
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
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
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
};

const removeById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const removeContact = await Contact.findByIdAndDelete(contactId);
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
};

module.exports = {
  getAll,
  add,
  getById,
  updateById,
  updateStatusContact,
  removeById,
};
