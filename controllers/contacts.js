const { NotFound, BadRequest } = require("http-errors");

const { joiSchema } = require("../models/contact");

const { Contact } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { favorite } = req.query;
    const { _id } = req.user;

    const skip = (page - 1) * limit;

    if (favorite) {
      const favoriteContacts = await Contact.find(
        { owner: _id, favorite },
        "_id name email phone favorite ",
        { skip: skip, limit: +limit }
      ).populate("owner", "email");

      res.json({
        status: "success",
        code: 200,
        data: {
          contacts: favoriteContacts,
        },
      });
      return;
    }

    const allContacts = await Contact.find(
      { owner: _id },
      "_id name email phone favorite ",
      { skip: skip, limit: +limit }
    ).populate("owner", "email");

    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: allContacts,
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
    const { email, _id } = req.user;

    if (error) {
      throw new BadRequest(error.message);
    }
    const newContact = { ...req.body, owner: _id };

    const result = await Contact.create(newContact);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: email,
        newContact: result,
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
