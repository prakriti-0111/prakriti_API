const db = require("@models");
const {  signIn } = require("./auth");
const {  CountryCreate,  CountryUpdate } = require("./country");
const {  StateCreate,  StateUpdate } = require("./state");
const {  DistrictCreate,  DistrictUpdate } = require("./district");
const {  PermissionCreate } = require("./permission");
const {  InvestorCreate,  InvestorUpdate } = require("./investor");
const {  EmployeeCreate,   EmployeeUpdate, SalaryCreate, SalaryUpdate } = require("./employee");
const {  AdminCreate,   AdminUpdate } = require("./admin");
const {  DistributorCreate, DistributorUpdate } = require("./distributor");
const {  RetailerCreate, RetailerUpdate } = require("./retailer");
const {  SupplierCreate, SupplierUpdate } = require("./supplier");
const {  ManagerCreate, ManagerUpdate } = require("./manager");
const {  WorkerCreate, WorkerUpdate } = require("./worker");
const {  UnitCreate,  UnitUpdate } = require("./unit");
const {  TaxCreate,  TaxUpdate } = require("./tax");
const {  CertificateCreate,  CertificateUpdate } = require("./certificate");
const {  CategoryCreate,  CategoryUpdate } = require("./category");
const {  SubcategoryCreate,  SubcategoryUpdate } = require("./subcategory");
const {  MaterialCreate,  MaterialUpdate } = require("./material");
const {  SizeCreate,  SizeUpdate } = require("./size");
const {  PurityCreate,  PurityUpdate } = require("./purity");
const { LeaveApplicationCreate, LeaveApplicationUpdate }=require("./leave_application");
const {  ExpenseCreate,  ExpenseUpdate } = require("./expense");

/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    CountryCreate,
    CountryUpdate,
    StateCreate,
    StateUpdate,
    DistrictCreate,
    DistrictUpdate,
    PermissionCreate,
    InvestorCreate,
    InvestorUpdate,
    EmployeeCreate,
    EmployeeUpdate,
    SalaryCreate,
    SalaryUpdate,
    AdminCreate,
    AdminUpdate,
    DistributorCreate,
    DistributorUpdate,
    RetailerCreate,
    RetailerUpdate,
    SupplierCreate,
    SupplierUpdate,
    ManagerCreate,
    ManagerUpdate,
    WorkerCreate,
    WorkerUpdate,
    UnitCreate,
    UnitUpdate,
    PurityCreate,
    PurityUpdate,
    TaxCreate,
    TaxUpdate,
    CertificateCreate,
    CertificateUpdate,
    CategoryCreate,
    CategoryUpdate,
    SubcategoryCreate,
    SubcategoryUpdate,
    SizeCreate,
    SizeUpdate,
    MaterialCreate, 
    MaterialUpdate, 
    LeaveApplicationCreate,
    LeaveApplicationUpdate,
    ExpenseCreate,  
    ExpenseUpdate,
}