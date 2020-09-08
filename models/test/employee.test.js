const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no arg were passed', () => {
    const emp = new Employee({}); // create new Employee, but don't set `name` attr value
    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, [], null];
    for (let firstName of cases) {
      const emp = new Employee({
        firstName,
        lastName: 'Doe',
        department: '551137c2f9e1fac808a5f572',
      });

      emp.validate((err) => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.not.exist;
        expect(err.errors.department).to.not.exist;
      });
    }
  });

  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, [], null];
    for (let lastName of cases) {
      const emp = new Employee({
        firstName: 'Joe',
        lastName,
        department: '551137c2f9e1fac808a5f572',
      });

      emp.validate((err) => {
        expect(err.errors.firstName).to.not.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.not.exist;
      });
    }
  });

  it('should throw an error if "department" is not a string', () => {
    const cases = [{}, [], null];
    for (let department of cases) {
      const emp = new Employee({
        firstName: 'Joe',
        lastName: 'Doe',
        department,
      });

      emp.validate((err) => {
        expect(err.errors.firstName).to.not.exist;
        expect(err.errors.lastName).to.not.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if arg are ok', () => {
    const emp = new Employee({
      firstName: 'Joe',
      lastName: 'Doe',
      department: '4edd40c86762e0fb12000003',
    });

    emp.validate((err) => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
