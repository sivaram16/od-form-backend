import { Staff } from '../models/staff-model'
import { RegisterType, LoginType } from '../services/user-services';
import *as jwt from 'jsonwebtoken'
import { ValidateHelper } from '../utils/validate-helper';
import *as bcrypt from 'bcrypt'

export class StaffService {

    registerStaff = async (requestData: RegisterType) => {
        try {
            let registerValidateResponse = await ValidateHelper.validateRegisterType(requestData, true, false)
            if (!registerValidateResponse['status']) {
                return registerValidateResponse;
            }
            const saltRounds = 10;
            let passwordHash = bcrypt.hashSync(requestData.password, saltRounds);
            let reqStaff = new Staff({
                name: requestData.name,
                email: requestData.email,
                password: passwordHash,
                user_type: 'teacher',
            })
            let staff = await reqStaff.save()
            return { status: true, message: "Staff registered Successfully" }
        }
        catch (e) {
            console.log(e)
        }
    }

    loginStaff = async (requestData: LoginType) => {
        try {
            let loginValidateResponse = await ValidateHelper.loginValidateType(requestData, true, false)
            if (!loginValidateResponse['status']) {
                return loginValidateResponse;
            }
            let staff = loginValidateResponse['staff']
            var token = jwt.sign({ user_id: staff.id }, process.env.JWT_SECRET)
            return { status: true, token: token }
        }
        catch (e) {
            console.log(e)
        }
    }

    getStaff = async () => {
        try {
            let getStaff = await Staff.find()
            return { status: true, data: getStaff }
        }
        catch (e) {
            console.log(e)
        }
    }


}