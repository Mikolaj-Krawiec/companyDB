const Employee = require('../models/employee.model');
const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Employee.find().populate('department'));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand).populate('department');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('department');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postOne = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    dep = await Department.findOne({ name: department });
    if (!dep) res.json({ message: 'No such department found' });

    const newEmployee = new Employee({
      firstName: firstName,
      lastName: lastName,
      department: dep._id,
    });
    await newEmployee.save();
    res.json({ message: 'OK', data: newEmployee });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putId = async (req, res) => {
  const { firstName, lastName, department } = req.body;

  try {
    const emp = await Employee.findById(req.params.id);
    if (emp) {
      dep = await Department.findOne({ name: department });
      if (!dep) res.json({ message: 'No such department found' });

      emp.firstName = firstName;
      emp.lastName = lastName;
      emp.department = dep._id;
      await emp.save();
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteId = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (emp) {
      await emp.remove();
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
