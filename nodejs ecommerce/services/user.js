const { StatusCodes } = require("http-status-codes");
const queryDatabase = require("../config/queryDatabase");
const queries = require("../config/queries").getInstance();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class User {
  static async register(reqData) {
    // check already other users exits or not / table has users or not
    const allUsers = await queryDatabase(queries.getAllProfiles());

    const { userName, email, password } = reqData;
    const hashedPassword = await bcrypt.hash(password, 12);
    const [userData] = await queryDatabase(queries.getUser(), [email]);

    // if user already exists with email return error
    if (userData) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "Email Already Exists",
          data: {},
        },
      };
    }
    // create new user
    const result = await queryDatabase(queries.createUser(), [
      userName,
      email,
      hashedPassword,
    ]);

    // if user not created
    if (!result?.insertId) {
      return {
        httpStatus: StatusCodes.BAD_REQUEST,
        body: {
          success: false,
          msg: "User Creation Failed",
          data: {},
        },
      };
    }

    const insertedId = result.insertId

    // by default role of every user is user but for first user its admin
    let role = "user"

    // if other users not exits then set role as admin
    if(allUsers.length===0){
      const id = insertedId
       const result = await queryDatabase(queries.updateProfileRole(), [id])

      if(result?.affectedRows){
        role = "admin"
      }

      //  if failed to set role
       if(!result?.affectedRows){
        return {
          httpStatus: StatusCodes.BAD_REQUEST,
          body: {
            success: false,
            msg: "Something is wrong",
            data: {},
          },
        };
       }
    }

    // token creation
    const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    // user is created
    return {
      httpStatus: StatusCodes.CREATED,
      body: {
        success: true,
        msg: "User Created Successfully",
        data: {
          userName,
          email,
          token,
          role
        },
      },
    };
  }

  static async login(reqData) {
    const { email, password } = reqData;

    const [userData] = await queryDatabase(queries.getUser(), [email]);

    // if user not exist with provided details
    if (!userData) {
      return {
        httpStatus: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          msg: "Invalid Credentials",
          data: {},
        },
      };
    }

    // check password match or not
    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    // if password match then return with error
    if (!isPasswordMatch) {
      return {
        httpStatus: StatusCodes.NOT_FOUND,
        body: {
          success: false,
          msg: "Invalid Credentials",
          data: {},
        },
      };
    }

    // token creation
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // password matched and user is valid
    return {
      httpStatus: StatusCodes.OK,
      body: {
        success: true,
        msg: "Login successful",
        data: { token },
      },
    };
  }

  static async getProfile(userId) {
    // search logged in user profile
    const [result] = await queryDatabase(queries.getProfile(), [userId]);

    // just in case user profile not found
    if(!result){
        return{
            httpStatus: StatusCodes.NOT_FOUND,
            body: {
              success: false,
              msg: "User Profile Not Found",
              data: {},
            },
          };
    }

      // user profile found
    return {
        httpStatus: StatusCodes.OK,
        body: {
          success: true,
          msg: "Logged In User Profile",
          data: result ,
        },
      };
  }
 
  static async getAllProfiles(userId) {
    // get logged in user profile
    const [loggedInUserProfile] = await queryDatabase(queries.getProfile(), [userId])
    // const roleIndex = loggedInUserProfile?.filter((user)=>{user.role === })indexOf("role")
    // console.log(loggedInUserProfile[roleIndex]);
    
    
    if(loggedInUserProfile?.role !== 'admin'){
      return{
        httpStatus: StatusCodes.FORBIDDEN,
        body: {
          success: false,
          msg: "You Are Not Allowed To See All Users",
          data: {},
        },
      };
    }

    // get all registered users
    const result = await queryDatabase(queries.getAllProfiles());
    if(!result){
        return{
            httpStatus: StatusCodes.NOT_FOUND,
            body: {
              success: false,
              msg: "No User Exists",
              data: {},
            },
          };
    }

    return {
        httpStatus: StatusCodes.OK,
        body: {
          success: true,
          msg: "All Users Profile",
          data: result,
        },
      };
  }


  // static async updateProfile(userId) {
  //   const result = await queryDatabase(queries.getProfile(),[userId]);
  //   if(!result){
  //       return{
  //           httpStatus: StatusCodes.NOT_FOUND,
  //           body: {
  //             success: false,
  //             msg: "User not found",
  //             data: {},
  //           },
  //         };
  //   }



  //   return {
  //       httpStatus: StatusCodes.OK,
  //       body: {
  //         success: true,
  //         msg: "All Users Profile",
  //         data: result,
  //       },
  //     };
  // }
}

module.exports = User;
