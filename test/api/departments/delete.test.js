const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {
  before(async () => {
    const testDepOne = new Department({
      _id: '1e9f1140d34a81216cfd4307',
      name: 'Department #1',
    });
    await testDepOne.save();
  });

  after(async () => {
    await Department.deleteMany();
  });

  it('/:id should delete document from db and return success', async () => {
    const res = await request(server).delete(
      '/api/departments/1e9f1140d34a81216cfd4307'
    );
    const deletedDepartment = await Department.findOne({
      _id: '1e9f1140d34a81216cfd4307',
    });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(deletedDepartment).to.be.null;
  });
});
