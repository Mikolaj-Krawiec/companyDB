const Employee = require('../employee.model.js');
const Department = require('../department.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
  //   before(async () => {
  //     try {
  //       const fakeDB = await MongoMemoryServer.create({
  //         binary: { version: '4.2.6' },
  //       });
  //       const uri = await fakeDB.getConnectionString();
  //       mongoose.connect(uri, {
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee_fn #1',
        lastName: 'Employee_ln #1',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Employee_fn #2',
        lastName: 'Employee_ln #2',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method.', async () => {
      const employees = await Employee.find({ firstName: 'Employee_fn #1' });
      const expectedLength = 1;
      expect(employees.length).to.be.equal(expectedLength);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'Employee_fn #1',
        lastName: 'Employee_ln #1',
        department: '4edd40c86762e0fb12000003',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee_fn #1',
        lastName: 'Employee_ln #1',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Employee_fn #2',
        lastName: 'Employee_ln #2',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'Employee_fn #1' },
        { $set: { firstName: 'Updated_Employee_fn #1' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: 'Updated_Employee_fn #1',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee_fn #2' });
      employee.firstName = 'Updated_Employee_fn #2';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: 'Updated_Employee_fn #2',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee_fn #1',
        lastName: 'Employee_ln #1',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
      const testEmpTwo = new Employee({
        firstName: 'Employee_fn #2',
        lastName: 'Employee_ln #2',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Employee_fn #1' });
      const removeEmployee = await Employee.findOne({
        firstName: 'Employee_fn #1',
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee_fn #2' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'Employee_fn #2',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });

  describe('Populate data', () => {
    before(async () => {
      const testDepartment = new Department({
        _id: '4edd40c86762e0fb12000003',
        name: 'Department #1',
      });
      await testDepartment.save();

      const testEmpOne = new Employee({
        firstName: 'Employee_fn #1',
        lastName: 'Employee_ln #1',
        department: '4edd40c86762e0fb12000003',
      });
      await testEmpOne.save();
    });

    it('should properly populate data', async () => {
        const employee = await Employee.findOne({ firstName: 'Employee_fn #1' }).populate('department');
        employee.firstName = 'Updated_Employee_fn #2';
        expect(employee.department.name).to.be.equal('Department #1');
      });
  });
});
