      import express, { response } from 'express';
      import mysql, { createConnection } from 'mysql';
      import cors  from 'cors';
      import jwt from 'jsonwebtoken';
      import bcrypt from 'bcrypt';
      import cookieParser from 'cookie-parser';
      import multer from 'multer';
      import path from 'path';
      import nodemailer from 'nodemailer';
      import randomstring from 'randomstring';
      import dotenv from 'dotenv';
      dotenv.config();

      console.log(process.env.DB_HOST);
      console.log(process.env.DB_USERNAME);
      console.log(process.env.DB_PASSWORD);
      console.log(process.env.DB_DBNAME);

      const salt = 10;
      const app = express();
      app.use(express.json());
      app.use(cors({
        origin: ["http://localhost:3000", "https://ccscheduling.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
      }));
      
      app.use(cookieParser());
      app.use('/uploads', express.static('uploads'));

      const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME
      });

      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb){
            const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
            const timestamp = Date.now();
            const filename = `${timestamp}${ext}`;
            cb(null, filename);
        },
    });

    let upload = multer({storage});
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'ccsched21@gmail.com',
          pass: 'meyj ahxv aiwi aroo',
        },
      });

      //update existing
      app.post('/university-info/createOrUpdate', upload.fields([
        { name: 'universityLogo', maxCount: 1 },
        { name: 'departmentLogo', maxCount: 1 }
      ]), (req, res) => {
        const universityLogoFile = req.files['universityLogo'];
        const departmentLogoFile = req.files['departmentLogo'];
      
        console.log('Received request:', req.body); // Log the request body
        console.log('University Logo File:', universityLogoFile); // Log university logo file
        console.log('Department Logo File:', departmentLogoFile); // Log department logo file
      
        const telephoneNumber = req.body.telephoneNumber;
        const address = req.body.address;
        const barangay = req.body.barangay;
        const province = req.body.province;
        const schoolName = req.body.schoolName;
        const universityId = req.body.universityId; // Get the universityId from the request body
      
        const values = [
          telephoneNumber,
          address,
          barangay,
          province,
          schoolName,
          universityId // 'universityId' is the identifier of the specific university to update
        ];
      
        db.query("SELECT * FROM university_info WHERE id = ?", [universityId], (err, existingData) => {
          if (err) {
            console.error('Database Error:', err);
            return res.send(err);
          }
      
          if (existingData.length > 0) {
            const existingInfo = existingData[0]; // Assuming only one university is found
      
            let updatedUniversityLogo = existingInfo.universityLogo;
            let updatedDepartmentLogo = existingInfo.departmentLogo;
      
            if (universityLogoFile) {
              updatedUniversityLogo = `uploads/${universityLogoFile[0].filename}`;
            }
            if (departmentLogoFile) {
              updatedDepartmentLogo = `uploads/${departmentLogoFile[0].filename}`;
            }
      
            const updateSQL = `
              UPDATE university_info
              SET universityLogo = ?,
                  departmentLogo = ?,
                  telephoneNumber = ?,
                  address = ?,
                  barangay = ?,
                  province = ?,
                  schoolName = ?
              WHERE id = ?`; // Assuming 'id' is the primary key of your university_info table
      
            const valuesWithId = [
              updatedUniversityLogo,
              updatedDepartmentLogo,
              telephoneNumber,
              address,
              barangay,
              province,
              schoolName,
              universityId
            ];
      
            db.query(updateSQL, valuesWithId, (err, updateResult) => {
              if (err) {
                return res.send(err);
              }
              return res.send('University information updated successfully');
            });
      
          } else {
            // Handle if data doesn't exist
            // ...
          }
        });
      });
      
    // Define an endpoint to fetch existing university information
      app.get('/university-info', (req, res) => {
        db.query('SELECT * FROM university_info', (err, existingData) => {
          if (err) {
            console.error('Databases Error:', err); // Log database errors
            return res.status(500).json({ error: err.message });
          }
          return res.status(200).json({ universityInfo: existingData });
        });
      });

      // Function to send the reset password email
        const sendResetPasswordEmail = async (recipientEmail,  resetLink) => {
          try {
            const mailOptions = {
              from: 'ccsched21@gmail.com',
              to: recipientEmail,
              subject: 'Reset Your Password',
              html: `<p>Dear user,</p>
                    <p>Please click <a href="${resetLink}">here</a> to reset your password.</p>
                    <p>Thank you!</p>`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
          } catch (error) {
            console.error(error);
          }
        };

        const generateRandomToken = () => {
          // Generate a random token using the library
          const token = randomstring.generate({
            length: 32, // Specify the desired length of the token
            charset: 'alphanumeric' // Use alphanumeric characters
          });
        
          return token;
        };

        const storeTokenInDatabase = async (recipientEmail) => {
          try {
            const token = generateRandomToken(); // Generate a random token
        
            const sql = "INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, current_timestamp())";
            await db.query(sql, [recipientEmail, token]);
        
            console.log('Token stored successfully:', token);
            return { success: 'Token stored successfully', token };
          } catch (error) {
            console.error('Error storing token:', error);
            return { error: 'Error storing token' };
          }
        };
        const checkEmailExistence = (recipientEmail) => {
          return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM userdata WHERE email = ?";
            db.query(sql, [recipientEmail], (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data.length > 0); // Resolve with true if email exists, false otherwise
              }
            });
          });
        };

        app.post('/forgot-password', async (req, res) => {
          const recipientEmail = req.body.email; // Assuming the email is sent in the request body
        
          const emailExists = await checkEmailExistence(recipientEmail);
          if (!emailExists) {
            return res.status(404).json({ error: 'Email does not exist in the database' });
          }
        
          // Store the token in the database
          const tokenResult = await storeTokenInDatabase(recipientEmail);
          if (tokenResult.error) {
            return res.status(500).json({ error: 'Error storing token' });
          }
        
          // Generate a reset link with the token
          const resetLink = `http://localhost:3000/password-reset/${tokenResult.token}`;
        
          // Send the reset password email
          await sendResetPasswordEmail(recipientEmail, resetLink);
        
          return res.json({ message: 'Reset password email sent successfully' });
        });
        
        app.post('/reset-password/:token', async (req, res) => {
          const resetToken = req.params.token;
        
          try {
            // Retrieve email from password_resets table based on the token
            const getEmailQuery = 'SELECT email FROM password_resets WHERE token = ?';
            db.query(getEmailQuery, [resetToken], async (err, resetData) => {
              if (err || resetData.length === 0) {
                return res.status(404).json({ error: 'Invalid or expired token' });
              }
        
              const recipientEmail = resetData[0].email;
        
              // Find the user_id based on the email from the userdata table
              const getUserIdQuery = 'SELECT user_id FROM userdata WHERE email = ?';
              db.query(getUserIdQuery, [recipientEmail], async (err, userData) => {
                if (err || userData.length === 0) {
                  return res.status(404).json({ error: 'User not found' });
                }
        
                const userId = userData[0].user_id;
        
                // Hash the new password
                bcrypt.hash(req.body.newPassword, salt, async (err, hashedPassword) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error hashing password' });
                  }
        
                  // Update the password in the userlogin table with the hashed password
                  const updatePasswordSql = 'UPDATE userlogin SET password = ? WHERE user_id = ?';
                  await db.query(updatePasswordSql, [hashedPassword, userId]);
        
                  return res.json({ message: 'Password updated successfully' });
                });
              });
            });
          } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }
        });

        const verifyUser = (req, res, next) => {
          const token = req.cookies.token;
          if(!token) {
              return res.json({Error: "You`re not authenticated"});
          }else {
              jwt.verify(token, "jwt-secret-key", (err, decoded) => {
                  if(err){
                      return res.json({Error: "Token is not okay"});
                  }else {
                    console.log("Decoded", decoded); // Log the decoded token here
                      req.username = decoded.username;
                      next();
                  }
              })
          }
      }

      app.get('/', verifyUser, (req, res) => {
          return res.json({Status: "Success", username: req.username});
      })
      app.post('/reset-password/', verifyUser, async (req, res) => {
        const { username } = req;
        const { oldPassword, newPassword } = req.body;
      
        try {
          const userData = await getUserData(username);
      
          if (!userData || !userData.password) {
            return res.status(404).json({ error: 'Invalid user or old password' });
          }
      
          const hashedPassword = userData.password;
      
          const isOldPasswordValid = await bcrypt.compare(oldPassword, hashedPassword);
      
          if (!isOldPasswordValid) {
            return res.status(401).json({ error: 'Invalid old password' });
          }
      
          const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      
          await updatePassword(username, hashedNewPassword);
      
          return res.json({ message: 'Password updated successfully' });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
      });
      

      const getUserData = (username) => {
        return new Promise((resolve, reject) => {
          db.query('SELECT password FROM userlogin WHERE username = ?', [username], (err, userData) => {
            if (err) {
              reject(err);
            } else {
              resolve(userData.length > 0 ? userData[0] : null);
            }
          });
        });
      };
      
      const updatePassword = (username, hashedNewPassword) => {
        return new Promise((resolve, reject) => {
          const updatePasswordSql = 'UPDATE userlogin SET password = ? WHERE username = ?';
          db.query(updatePasswordSql, [hashedNewPassword, username], (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };
      
      
      app.post('/verify-old-password/', verifyUser, (req, res) => {
        const { username } = req;
        const { oldPassword } = req.body;
        console.log('Username from token:', username); // Log username from token

        try {
          // Retrieve the current hashed password from the database based on the username
          db.query('SELECT password FROM userlogin WHERE username = ?', [username], async (err, userData) => {
            if (err || userData.length === 0) {
              return res.status(404).json({ error: 'User not found' });
            }
      
            const hashedPassword = userData[0].password;
      
            // Compare the provided old password with the hashed password from the database
            bcrypt.compare(oldPassword, hashedPassword, async (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
              }
              if (!result) {
                return res.status(401).json({ error: 'Invalid old password' });
              }
      
              // Old password matches, allow changing the password
              return res.json({ message: 'Old password verified' });
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        });
        
      app.post('/upload', upload.single('images'), (req, res) => {
          if(!req.file){
              return res.status(400).json({message: 'Np image file upload'});
          }

          const imagePath = `uploads/${req.file.filename}`;

          return res.status(200).json({message: 'Image uploaded Successfully', imagePath });
      });

      app.get('/user', (req, res) => {
          db.query("SELECT user_id, firstName, middleName, lastName, email, CONCAT('http://localhost:8081/', images) AS imageUrl, role FROM userdata", (err, data) => {
              if(err) {
                  return res.json(err);
              }
              return res.json(data);
          });
      });

      app.get("/user/check/:firstName/:lastName", (req, res) => {
          const firstName = req.params.firstName;
          const lastName = req.params.lastName;

          db.query("SELECT * FROM userdata WHERE firstName = ? AND lastName = ?", [firstName, lastName], (err, data) => {
              if (err){
                  return res.json(err);
              }
              return res.json({exists: data.length > 0 });
          });
      });

      app.get('/user/roles', (req, res) => {
          db.query("SELECT * FROM role WHERE role_id IN (1, 2)", (err, data) => {
              if(err){
                  return res.status(500).json({ error: "Error fetching role"});
              }
              return res.json(data);
          });
      });

      app.delete('/user/:user_id/delete', (req, res) => {
          const userId = req.params.user_id;
          db.query('DELETE FROM userdata WHERE user_id = ?', [userId], (err, data) => {
              if(err) {
                  return res.send(err);
              }
              return res.send(data);
          });
      });

      app.post('/user/create', upload.single('images'), (req, res) => {
          const firstName = req.body.firstName;
          const middleName = req.body.middleName;
          const lastName = req.body.lastName;
          const email = req.body.email;
          const username = req.body.username;
          const password = req.body.password;
          const role = req.body.role;
          const images = req.file ? `uploads/${req.file.filename}` : null;
      
          // Ensure values is defined before the bcrypt callback
          const values = [
              firstName,
              middleName,
              lastName,
              email,
              images,
              role,
          ];
      
          console.log("Plain Text Password:", password); // Log the plain text password before hashing
      
          bcrypt.hash(password.toString(), salt, (err, hash) => {
              if (err) return res.json({ Error: "Error hashing password" });
      
              // Log the hashed password before storing it
              console.log("Hashed Password:", hash);
      
              // Update values with hashed password before the query
              values.push(hash);
      
              const sql = "INSERT INTO userdata (firstName, middleName, lastName, email, images, role) VALUES (?, ?, ?, ?, ?, ?)";
              db.query(sql, values, (err, resultUserdata) => {
                  if (err) {
                      return res.send(err);
                  }
      
                  const user_id = resultUserdata.insertId;
                  const userLoginValues = [
                      user_id,
                      username,
                      hash, // Using the hashed password here
                  ];
      
                  const userLoginSql = "INSERT INTO userlogin (user_id, username, password) VALUES (?, ?, ?)";
                  db.query(userLoginSql, userLoginValues, (err, resultUserlogin) => {
                      if (err) {
                          return res.send(err);
                      }
                      return res.json({
                          usedata: resultUserdata,
                          userlogin: resultUserlogin,
                      });
                  });
              });
          });
      });
      
      app.post('/userlogin', async (req, res) => {
          const username = req.body.username;
          const enteredPassword = req.body.password;
      
          try {
              const sql = "SELECT * FROM userlogin WHERE username = ?";
              db.query(sql, [username], async (err, data) => {
                  if (err) {
                      console.error("Error fetching user:", err);
                      return res.json({ error: "Internal server error" });
                  }
                  if (data.length > 0) {
                      const storedHashedPassword = data[0].password;
      
                      try {
                          // Log the entered and stored hashed passwords
                          console.log("Entered Hashed Password:", enteredPassword);
                          console.log("Stored Hashed Password:", storedHashedPassword);
      
                          // Compare the entered password with the stored hashed password
                          const match = await bcrypt.compare(enteredPassword, storedHashedPassword);
                          if (match) {
                              const username = data[0].username;
                              const token = jwt.sign({username}, "jwt-secret-key", {expiresIn: '1d'});
                              res.cookie('token', token);
                              return res.json({ Status: "Success" }); // Ensure the key is 'Status'
                          } else {
                              console.log("Incorrect password for user:", username);
                              return res.json({ Error: "Password not matched!" });
                          }
                      } catch (error) {
                          console.error("Comparison error:", error);
                          return res.json({ error: "Comparison error" });
                      }
                  } else {
                      console.log("User not found:", username);
                      return res.json({ Error: "No data" });
                  }
              });
          } catch (error) {
              console.error("Database error:", error);
              return res.json({ error: "Database error" });
          }
      });

      app.get('/userdata/:username', (req, res) => {
        const username = req.params.username;
        const sql = "SELECT u.user_id, u.firstName, u.middleName, u.lastName, u.email, u.images, u.role FROM userdata u INNER JOIN userlogin ul ON u.user_id = ul.user_id WHERE ul.username = ?";
        db.query(sql, [username], (err, data) => {
          if (err) {
            return res.json("Error");
          }
          if (data.length > 0) {
            return res.json(data);
          } else {
            return res.json("No data");
          }
        });
      });
      
        app.get('/logout', (req, res) => {
          res.clearCookie('token');
          return res.json({Status: "Success"});
        })

        app.get('/prof', (req, res) => {
          const sql = "SELECT count(*) as prof FROM users;";
          db.query(sql,(err, data) => {
            if (err) {
              return res.json("Error");
            }
            if (data.length > 0) {
              const prof = data[0].prof;
              return res.json({ prof }); // Return an object with roomCount property
            } else {
              return res.json({ prof: 0 }); // Default value if there's no data
            }
          });
        });
      
        app.get('/blockCount', (req, res) => {
          const sql = "SELECT sum(total) as blockCount FROM blocks;";
          db.query(sql,(err, data) => {
            if (err) {
              return res.json("Error");
            }
            if (data.length > 0) {
              const blockCount = data[0].blockCount;
              return res.json({ blockCount }); // Return an object with roomCount property
            } else {
              return res.json({ blockCount: 0 }); // Default value if there's no data
            }
          });
        });
      
        app.get('/classs', (req, res) => {
          const sql = "SELECT count(*) as classCount FROM block_course_assignment;";
          db.query(sql, (err, data) => {
            if (err) {
              return res.status(500).json({ error: "Error fetching data" });
            }
            if (data.length > 0) {
              const classCount = data[0].classCount;
              return res.json({ classCount });
            } else {
              return res.json({ classCount: 0 }); 
            }
          });
        });
        
        app.get('/room', (req, res) => {
          const sql = "SELECT count(*) as roomCount FROM room;";
          db.query(sql, (err, data) => {
            if (err) {
              return res.status(500).json({ error: "Error fetching data" });
            }
            if (data.length > 0) {
              const roomCount = data[0].roomCount;
              return res.json({ roomCount }); // Return an object with roomCount property
            } else {
              return res.json({ roomCount: 0 }); // Default value if there's no data
            }
          });
        });

      app.listen(8081, () => {
          console.log("Running...");
      });