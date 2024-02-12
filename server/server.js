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
import crypto from 'crypto';

dotenv.config();
const accessTokenSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

console.log('Access Token Secret:', accessTokenSecret);
console.log('Refresh Token Secret:', refreshTokenSecret);
console.log(process.env.DB_HOST);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DBNAME);

const salt = 10;  
const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());
const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2]
const devOrigin = ['https://ccsched.onrender.com', 'https://ccsched-azure.vercel.app', 'https://ccscheduling-management-system.vercel.app' ,'https://ccscheds.vercel.app','https://ccscheds-qqn2tok82-michelle-solimans-projects.vercel.app', 'http://localhost:8081', 'http://localhost:3000' ]
const allowedOrigins = process.env.NODE_ENV === 'ccsched' ? prodOrigins : devOrigin

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed by CORS'));
    }
  },
  credentials: true, // if you need to allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

  app.post('/refresh', (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }
    
    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
    
      res
        .header('Authorization', accessToken)
        .send(decoded.user);
    } catch (error) {
      return res.status(400).send('Invalid refresh token.');
    }
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
    const resetLink = `https://ccsched.onrender.com/password-reset/${tokenResult.token}`;
  
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
    db.query("SELECT user_id, firstName, middleName, lastName, email, CONCAT('https://ccsched.onrender.com/', images) AS imageUrl, role FROM userdata", (err, data) => {
        if(err) {
            return res.json(err);
        }
        return res.json(data);
    });
});

// Check if a user with the given email, username, and name exists
app.get("/user/check/:email/:username/:firstName/:lastName", (req, res) => {
  const email = req.params.email;
  const username = req.params.username;
  const firstName = req.params.firstName;
  const lastName = req.params.lastName;

  // Assuming there is a common field like user_id that links both tables
  const query = `
    SELECT * FROM userlogin AS ul
    JOIN userdata AS ud ON ul.user_id = ud.user_id
    WHERE ul.username = ? OR ud.email = ? OR (ud.firstName = ? AND ud.lastName = ?)
  `;

  db.query(
    query,
    [username, email, firstName, lastName],
    (err, data) => {
      if (err) {
        return res.json(err);
      }

      const existingUser = data[0];

      if (existingUser) {
        let warnings = [];

        if (existingUser.email === email) {
          warnings.push("Email already exists.");
        }

        if (existingUser.username === username) {
          warnings.push("Username already exists.");
        }

        if (
          existingUser.firstName === firstName &&
          existingUser.lastName === lastName
        ) {
          warnings.push("User with the same name already exists.");
        }

        return res.json({ exists: true, warnings });
      }

      return res.json({ exists: false });
    }
  );
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
                      console.log("login successfully");
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
    console.log("LOGOUT");
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

  app.get("/rooms", (req, res) => {
    const sql = "SELECT * FROM room WHERE roomName <> 'N/A' ORDER BY roomName ASC";
    db.query(sql, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  });        

// Check if a room exists with the given name (after removing spaces and special characters)
app.get("/rooms/check/:start/:end/:sem", (req, res) => {
const startYear = req.params.start;
const endYear = req.params.end;
const semester = req.params.sem;

db.query("SELECT * FROM academic_year WHERE start = ? AND end = ? AND sem = ?", [startYear, endYear, semester], (err, data) => {
  if (err) {
    console.error(err);
    return res.status(500).json(err);
  }
  return res.json({ exists: data.length > 0 });
});
});


//add new room
app.post("/rooms/create", (req, res) => {
    const id = req.body.id;
    const roomName = req.body.roomName;
    const location = req.body.location;
    const capacity = req.body.capacity;
    const type = req.body.type;
    db.query("INSERT INTO room (roomName, location, capacity, type) VALUES (?, ?, ?, ?)", [roomName, location, capacity, type], (err, result) => {
        if(err){
            console.log(err);   
        } res.send("Added Succesfully!");
    });
});

//update 
app.put("/rooms/:id/update", (req, res) => {
    const roomId = req.params.id;
    const sql = "UPDATE room SET `roomName` = ? , `location` = ? , `capacity` = ?, `type` = ? WHERE id = ?";
    const values = [
        req.body.roomName,
        req.body.location,
        req.body.capacity,
        req.body.type,
        roomId
    ];
    db.query(sql, values, (err, data) => {
        if(err){
            console.log(err);
            return res.send(err);
        } else {
            console.log(data);
            return res.json(data);
        }
    });
});

//delete existing room
app.delete("/rooms/:id/delete", (req, res) => {
    const roomId = req.params.id;
    db.query("DELETE FROM room WHERE id = ?", [roomId], (err, result) => {
        if(err){
            return res.send(err);
        }else {
            return res.send(result);
        }
    });
});

// View all block list
app.get("/block", (req, res) => {
const sql = "SELECT * FROM blocks";
db.query(sql, (err, data) =>{
    if(err){
      console.log(err);
      return res.json(err);
    }
      return res.json(data);
  });
});

// Check if a room exists with the given name
app.get("/block/check/:program", (req, res) => {
const originalProgramName = req.params.program;
const normalizedProgram = originalProgramName.replace(/[^a-zA-Z0-9]/g, ''); // Remove all non-alphanumeric characters

console.log('Normalized Program:', normalizedProgram);

db.query("SELECT * FROM blocks WHERE REPLACE(REPLACE(program, ' ', ''), '-', '') = ?", [normalizedProgram], (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err);
  }
  return res.json({ exists: data.length > 0 });
});
});



// view all specific block per year and per program
app.get("/block/wh_blk", (req, res) => {
const sql = "SELECT * FROM wh_blk";
db.query(sql, (err, data) => {
    if (err) {
        console.log(err);
        return res.json(err);
    }
    return res.json(data);
});
});

//add new room
app.post("/block/create", (req, res) => {
const program = req.body.program;
const firstYear = req.body.firstYear;
const secondYear = req.body.secondYear;
const thirdYear = req.body.thirdYear;
const fourthYear = req.body.fourthYear;
const total = req.body.total;
db.query("INSERT INTO blocks (program, firstYear, secondYear, thirdYear, fourthYear, total) VALUES (?, ?, ?, ?, ?, ?)", [program, firstYear, secondYear, thirdYear, fourthYear, total], (err, result) => {
  if(err){
      console.log(err);   
  } res.send(result);
});
});

//update 
app.put("/block/:id/update", (req, res) => {
const blockId = req.params.id;
const sql = "UPDATE blocks SET `program` = ?, `firstYear` = ?, `secondYear` = ?, `thirdYear` = ?, `fourthYear` = ?, `total` = ? WHERE id = ?";
const values = [
  req.body.program,
  req.body.firstYear,
  req.body.secondYear,
  req.body.thirdYear,
  req.body.fourthYear,
  req.body.total,
  blockId
];
db.query(sql, values, (err, data) => {
  if(err){
      console.log(err);
      return res.send(err);
  } else {
      console.log(data);
      return res.json(data);
  }
});
});

//delete existing room
app.delete("/block/:id/delete", (req, res) => {
const blockId = req.params.id;
db.query("DELETE FROM blocks WHERE id = ?", [blockId], (err, result) => {
  if(err){
      return res.send(err);
  }else {
      console.log("Received blockId: " + blockId);
      return res.send(result);
  }
});
});

// View all specialization
app.get('/specialization', (req, res) => {
const sql = `
SELECT
s.User_id,
GROUP_CONCAT(DISTINCT c.course_id ORDER BY c.course_id) AS course_ids,
GROUP_CONCAT(DISTINCT c.course_code ORDER BY c.course_id) AS course_codes,
GROUP_CONCAT(DISTINCT c.course_name ORDER BY c.course_id) AS course_names,
GROUP_CONCAT(DISTINCT c.duration ORDER BY c.course_id) AS durations,
GROUP_CONCAT(DISTINCT u.fname ORDER BY c.course_id) AS fnames,
GROUP_CONCAT(DISTINCT u.lname ORDER BY c.course_id) AS lnames
FROM specialization s
INNER JOIN courses c ON s.course_id = c.course_id
INNER JOIN users u ON s.User_id = u.User_id
GROUP BY s.User_id;

`;  

db.query(sql, (err, data) => {
if (err) {
  return res.json(err);
} else {
  return res.json(data);
}
});
});

app.get('/specialization/course/:User_id', (req, res) => {
const User_id = req.params.User_id;
const sql = `
SELECT s.*, c.course_code, c.course_name, u.fname, u.lname
FROM specialization s
JOIN courses c ON s.course_id = c.course_id
JOIN users u ON s.User_id = u.User_id
WHERE s.User_id = ?;

`;  

db.query(sql, [User_id], (err, data) => {
if (err) {
  return res.json(err);
} else {
  return res.json(data);
}
});
});

app.get('/specialization/users', (req, res) => {
db.query("SELECT User_id, fname, lname, role FROM users", (err, data) => {
if (err) {
return res.status(500).json({ error: "Failed to retrieve user data" });
} else {
return res.json(data);
}
});
});

app.get('/specialization/courses', (req, res) => {
const userRole = req.query.userRole;

let sql = `
SELECT course_id, course_code, course_name
FROM courses
`;

if (userRole === '1') {
// If the user's role is 1, filter courses with duration <= 3
sql += ' WHERE duration <= 3';
}

db.query(sql, (err, data) => {
if (err) {
return res.status(500).json({ error: "Failed to retrieve course data" });
} else {
return res.json(data);
}
});
});

// add
app.post("/specialization/create", (req, res) => {
const User_id = req.body.User_id; // Use lowercase 'user_id'
const course_id = req.body.course_id;
console.log('Received user_id:', User_id);
console.log('Received id:', course_id);
db.query("INSERT INTO specialization (User_id, course_id) VALUES (?, ?)", [User_id, course_id], (err, data) => {
if (err) {
  console.error('Error:', err);
  return res.status(500).json({ error: "Failed to insert specialization" });
} else {
  res.send(data);
}
});  
});

app.get('/specialization/unassigned-courses', (req, res) => {
const sql = `
SELECT *
FROM courses
WHERE course_id NOT IN (
SELECT DISTINCT course_id
FROM specialization
);
`;

db.query(sql, (err, data) => {
if (err) {
return res.status(500).json({ error: "Failed to retrieve unassigned course data" });
} else {
return res.json(data);
}
});
});

app.get('/specialization/assign', (req, res) => {
const sql = `
SELECT 
c.course_code,
c.course_name,
COUNT(DISTINCT pcm.course_id, pcm.program, pcm.year, pcm.block) as total_blocks,
COUNT(DISTINCT s.User_id) as professors 
FROM program_course_assignment_reference pcm
INNER JOIN specialization s ON pcm.course_id = s.course_id
INNER JOIN courses c ON pcm.course_id = c.course_id
GROUP BY pcm.course_id, c.course_code, c.course_name
HAVING total_blocks > 3 AND professors <= 2;

`;

db.query(sql, (err, data) => {
if (err) {
return res.status(500).json({ error: "Failed to retrieve unassigned course data" });
} else {
return res.json(data);
}
});
});

app.get("/specialization/check/:name/:course", (req, res) => {
const name = req.params.User_id;
const course = req.params.course_id;
db.query("SELECT * FROM specialization WHERE User_id = ? AND course_id = ?", [name, course], (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json({ exists: data.length > 0 });
});
});

//update
app.put("/specialization/:id/update", (req, res) => {
const specializationId = req.params.id;
const sql = "UPDATE specialization SET `prof` = ?, `specialization` = ? WHERE id = ?";
const values = [
req.body.name, // Change to 'name' to match your form
req.body.course, // Change to 'course' to match your form
specializationId
];

db.query(sql, [...values, specializationId], (err, data) => {
if(err){
    res.status(500).json({ error: "Failed to update specialization" });
} else {
    res.status(200).json({ message: "Specialization updated successfully" });
}
});
});


// delete
app.delete("/specialization/:userId/:courseId/delete", async (req, res) => {
const { userId, courseId } = req.params;

try {
// Delete records from program_course_assignment_reference
await db.query(
"DELETE FROM program_course_assignment_reference WHERE User_id = ? AND course_id = ?",
[userId, courseId]
);

// Once the associated records are deleted, proceed to delete from specialization
await db.query(
"DELETE FROM specialization WHERE course_id = ? AND User_id = ?",
[courseId, userId]
);

return res.status(200).send(`Specialization with Course ID ${courseId} for User ${userId} deleted successfully`);
} catch (error) {
return res.status(500).send(error);
}
});

// View all course list
app.get("/course", (req, res) => {
const { program } = req.query;
let sql = "SELECT * FROM courses";

if (program) {
// Apply filtering if a program is specified
sql = `SELECT c.*
FROM courses c
JOIN program_course_mapping pcm ON c.course_id = pcm.course_id
WHERE pcm.program = ?`;
}

db.query(sql, [program], (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json(data);
});
});

app.get("/course/year/:course_id", (req, res) => {
const course_id = req.params.course_id;
const sql = "SELECT pca.program, pca.year_level, pca.blocks FROM courses AS c INNER JOIN program_course_mapping AS pca ON c.course_id = pca.course_id WHERE c.course_id = ?";
db.query(sql, [course_id], (err, data) => {
if (err) {
console.log(err);
return res.status(500).json(err);
}
return res.json(data);
});
});

// check duplicate course
app.get("/course/check/:course_code/:course_name", (req, res) => {
const course_code = req.params.course_code;
const course_name = req.params.course_name;

db.query("SELECT * FROM courses WHERE course_code = ? AND course_name = ?", [course_code, course_name] ,(err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json({ exists: data.length > 0 }); // Check if any data was fetched
});
});

//get all program
app.get("/course/program", (req, res) => {
const sql = "SELECT program from blocks";
db.query(sql, (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json(data);
});
});

//add new course
app.post("/course/create", (req, res) => {
const code = req.body.course_code;
const name = req.body.course_name;
const units = req.body.units;
let program = req.body.program;
if (Array.isArray(program)) {
program = program.join(',');
}
const yearLevel = req.body.yearLevel;
const sem = req.body.sem;
const duration = req.body.duration;
const ftf = req.body.ftf;
const online = req.body.online;
const lab = req.body.lab;

const sql = "CALL CalculateAndInsertBlocks(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
db.query(
sql,
[code, name, units, program, yearLevel, sem, duration, ftf, online, lab],
(err, result) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.send(result);
}
);
});

//update 
app.put("/course/update/:courseId", (req, res) => {
const courseId = req.params.courseId;
const {
course_code,
course_name,
units,
sem,
duration,
ftf,
online,
lab,
program, 
yearLevel 
} = req.body;

const sql = "CALL CalculateAndInsertBlocks(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";;

db.query(
sql,
[course_code, course_name, units, sem, duration, ftf, online, lab, program, yearLevel, courseId],
(err, result) => {
if (err) {
console.error("Error updating course:", err);
res.status(500).send("Error updating course");
} else {
console.log("Course updated successfully");

// Update program_course_mapping
updateProgramCourseMapping(courseId, programs, yearLevel, res);
}
}
);
});

//delete
app.delete("/course/:course_id/delete", (req, res) => {
const courseId = req.params.course_id;

db.query("DELETE FROM program_course_mapping WHERE course_id = ?", [courseId], (err, mappingResult) => {
if (err) {
  return res.send(err);
} else {
  db.query("DELETE FROM block_course_assignment WHERE course_id = ?", [courseId], (err, assignmentResult) => {
      if (err) {
          return res.send(err);
      } else {
          db.query("DELETE FROM courses WHERE course_id = ?", [courseId], (err, courseResult) => {
              if (err) {
                  return res.send(err);
              } else {
                  return res.send({
                      mappingResult,
                      assignmentResult,
                      courseResult
                  });
              }
          });
      }
  });
}
});
});

app.get('/profs', (req, res) => {
db.query('SELECT * FROM users', (err, data) =>{
if(err){
    return res.json(err);
}else {
    return res.json(data);
}
});
});



app.get('/profs/roles', (req, res) => {
const roleId = req.params.roleId;
const sql = 'SELECT * FROM role';
db.query(sql, [roleId], (err, data) => {
if (err) {
console.log(err);
return res.status(500).json({ error: 'An error occurred while fetching role data' });
}
return res.json(data);
});
});

app.get('/profs/roles/:roleId', (req, res) => {
const roleId = req.params.roleId;
const sql = 'SELECT role FROM role WHERE role_id = ?';
db.query(sql, [roleId], (err, data) => {
if (err) {
console.log(err);
return res.status(500).json({ error: 'An error occurred while fetching role data' });
}
return res.json(data);
});
});

app.get("/profs/check/:fname/:lname", (req, res) => {
const originalFname = req.params.fname;
const originalLname = req.params.lname;
const normalizedFnameWithoutSpaces = originalFname.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters and spaces
const normalizedLnameWithoutSpaces = originalLname.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters and spaces

db.query("SELECT * FROM users WHERE REPLACE(CONCAT(fname, lname), ' ', '') = ?", [normalizedFnameWithoutSpaces + normalizedLnameWithoutSpaces], (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json({ exists: data.length > 0 });
});
});


app.post('/profs/create', (req, res) =>{
const fname = req.body.fname;
const mname = req.body.mname;
const lname = req.body.lname;
const role = req.body.role;
db.query("INSERT INTO users (fname, mname, lname, role) VALUES (?, ?, ?, ?)", [fname, mname, lname, role], (err, data) => {
if(err){
    console.log(err);
    return res.send(err);
} else {
    return res.send(data);
}
});
});

app.put("/profs/:userId/update", (req, res) => {
const userId = req.params.userId;  // Ensure it's named correctly
const sql = "UPDATE users SET `fname` = ?, `mname` = ?, `lname` = ?, `role` = ? WHERE User_id = ? ";
const values = [req.body.fname, req.body.mname, req.body.lname, req.body.role, userId];

console.log('SQL Query:', sql);
console.log('Query Values:', values);

db.query(sql, values, (err, data) => {
if (err) {
console.error('Error executing SQL query:', err);
return res.status(500).send(err);
} else {
console.log('Update successful. Data:', data);
return res.json(data);
}
});
});

app.put("/summer_sched/:classId/update", (req, res) => {
const classId = req.params.classId;
const { bestSchedule, selectedAcademicYear, selectedSemester } = req.body;

// Split the selected academic year string into two separate years
const [startYear, endYear] = selectedAcademicYear.split(" - ");

// Create an academic year object
const academicYear = {
start: startYear.trim(), // Trim any leading or trailing spaces
end: endYear.trim() // Trim any leading or trailing spaces
};

console.log("hdsad: ", academicYear);
console.log("Summer: ", classId);
console.log("req.body: ", req.body);
console.log("bestSchedule: ", bestSchedule);

const queries = bestSchedule.map((schedule) => {
const { day, startTime, endTime, room, color } = schedule;
return {
sql:
  "UPDATE summer_sched SET `day` = ?, `start_time` = ?, `end_time` = ?, `room` = ?, `color` = ?, `start` = ?, `end` = ?, `sem` = ? WHERE summer_id = ? ",
values: [
  day,
  startTime,
  endTime,
  room.roomName,
  color,
  academicYear.start,
  academicYear.end,
  selectedSemester,
  classId,
],
};
});

const updateQueries = queries.map((query) => {
return new Promise((resolve, reject) => {
db.query(query.sql, query.values, (err, data) => {
  if (err) {
    console.error("Error executing SQL query:", err);
    reject(err);
  } else {
    console.log("Update successful. Data:", data);
    resolve(data);
  }
});
});
});

Promise.all(updateQueries)
.then(() => res.json({ success: true }))
.catch((error) => res.status(500).json({ error }));
});

app.get("/summer_sched/room", (req, res) => {
const summerSlotsQuery = "SELECT SUM(slot) AS totalSlots FROM summer";
db.query(summerSlotsQuery, (err, summerResult) => {
if (err) {
console.error("Error executing MySQL query for summer slots: ", err);
res.status(500).json({ message: "Internal server error" });
return;
}

try {
const totalSummerSlots = summerResult[0].totalSlots || 0;

if (totalSummerSlots <= 15) {
  const regularRoomQuery = "SELECT * FROM room WHERE type = 'regular' ORDER BY RAND() LIMIT 2";
  const labRoomQuery = "SELECT * FROM room WHERE type = 'laboratory' ORDER BY RAND() LIMIT 2";

  db.query(regularRoomQuery, (regularErr, regularResults) => {
    if (regularErr) {
      console.error("Error executing MySQL query for regular rooms: ", regularErr);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    db.query(labRoomQuery, (labErr, labResults) => {
      if (labErr) {
        console.error("Error executing MySQL query for laboratory rooms: ", labErr);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // Concatenate the regular room and the first two laboratory rooms
      const filteredRooms = [...regularResults, ...labResults];

      res.json(filteredRooms);
    });
  });
} else {
  // If the total sum of slots exceeds 15, return all rooms
  const sql = "SELECT * FROM room";
  db.query(sql, (roomErr, results) => {
    if (roomErr) {
      console.error("Error executing MySQL query for rooms: ", roomErr);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.json(results);
  });
}
} catch (err) {
console.error("Error accessing totalSlots property: ", err);
res.status(500).json({ message: "Internal server error" });
}
});
});

app.get("/summer_sched/data", (req, res) => {
const sql = `SELECT * 
FROM summer_sched as sc
INNER JOIN summer as s ON sc.id = s.id
INNER JOIN users as u ON s.User_id = u.User_id
INNER Join courses as c ON s.course_id = c.course_id;`;
db.query(sql, (err, results) => {
if (err) {
console.error("Error executing MySQL query: ", err);
res.status(500).json({ message: "Internal server error" });
return;
}
res.json(results);
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

app.put("/summer_sched/archive/update", (req, res) => {

});

app.put("/summer_sched/reset", (req, res) => {
const resetQuery = "UPDATE summer_sched SET `day` = NULL, `start_time` = NULL, `end_time` = NULL, `room` = NULL, `color` = NULL";

db.query(resetQuery, (error, results) => {
if (error) {
console.error('Error resetting summer schedule:', error);
res.status(500).json({ error: 'Internal Server Error' });
} else {
console.log('Summer schedule reset successfully.');
res.json({ success: true });
}
});
});



app.get('/summer_sched/archive', (req, res) => {
const acadId = req.params.acadId;

const query =  `SELECT * from academic_year;
`;
db.query(query, [acadId], (err, results) => {
if (err) {
console.error('Error executing the query: ' + err);
res.status(500).send('Error fetching data from the database');
} else {
res.json(results);
}
});
});

app.get('/summer_sched/curriculum', (req, res) => {
const acadId = req.params.acadId;

const query =  `SELECT *
FROM academic_year
ORDER BY academic_id DESC
LIMIT 1;
`;
db.query(query, [acadId], (err, results) => {
if (err) {
console.error('Error executing the query: ' + err);
res.status(500).send('Error fetching data from the database');
} else {
res.json(results);
}
});
});

app.get('/summer_sched/prof/:userId', async (req, res) => {
try {
const userId = req.params.userId;
const professor = await fetchProfessorNameFromDatabase(userId);
if (professor) {
    res.status(200).json({ fullName: professor.fullName });
} else {
    res.status(404).json({ error: 'Professor not found' });
}
} catch (error) {
console.error('Error fetching professor name:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

app.delete('/profs/:user_id/delete', (req, res) => {
const userId = req.params.user_id; 
db.query("DELETE FROM users WHERE User_id = ?", [userId], (err, data) => {
if (err) {
console.error(err);
return res.status(500).json({ error: 'An error occurred while deleting the user' });
} else {
console.log(`User with ID ${userId} deleted successfully`);
return res.json({ message: 'User deleted successfully' });
}
});
});

app.get("/manual", (req, res) => {
const sql = "SELECT * FROM specialization";
db.query(sql, (err, data) =>{
if(err){
  console.log(err);
  return res.json(err);
}
  return res.json(data);
});
});

app.get("/manual/professors/:courseId", (req, res) => {
const courseId = req.params.courseId;
let sql = `
SELECT s.*, u.fname, u.lname
FROM specialization AS s
INNER JOIN users AS u ON s.User_id = u.User_id
WHERE s.course_id = ? 
GROUP BY s.User_id, u.fname, u.lname;
`;

db.query(sql, [courseId], (err, professorsData) => {
if (err) {
return res.json(err);
} else {
return res.json(professorsData);
}
});
});


app.get("/manual/courses", (req, res) => {
let sql = `
SELECT * FROM courses;
`;

db.query(sql, (err, coursesData) => {
if (err) {
return res.json(err);
} else {
return res.json(coursesData);
}
});
});


app.get("/manual/block/:courseId", (req, res) => {
const courseId = req.params.courseId;
let sql = `Select count(*) as total_blocks FROM block_course_assignment WHERE course_id = ?; `;

db.query(sql, [courseId], (err, coursesData) => {
if (err) {
return res.json(err);
} else {
return res.json(coursesData);
}
});
});
app.get('/manual/program-year-block/:courseId', (req, res) => {
const courseId = req.params.courseId;

const query =  `SELECT bc.*
FROM specialization s
INNER JOIN courses c ON s.course_id = c.course_id
INNER JOIN (
SELECT
course_id,
program,
year,
block
FROM block_course_assignment 
) bc ON c.course_id = bc.course_id
WHERE c.course_id = ?;
`;
db.query(query, [courseId], (err, results) => {
if (err) {
console.error('Error executing the query: ' + err);
res.status(500).send('Error fetching data from the database');
} else {
res.json(results);
}
});
});

app.get('/manual/room', (req, res) => {
const sql = "SELECT * FROM room";
db.query(sql, (err, data) =>{
if(err){
  console.log(err);
  return res.json(err);
}
  return res.json(data);
});
});
app.get('/manual/rooms/:roomType', (req, res) => {
const { roomType } = req.params;
let sql;

if (roomType === 'Regular' || roomType === 'Laboratory') {
sql = `SELECT * FROM room WHERE type = '${roomType}'`;
} else {
sql = 'SELECT * FROM room WHERE type != "Laboratory"';
}

db.query(sql, (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json(data);
});
});

app.post('/manual/create', (req, res) => {
const course = req.body.course;
const professor = req.body.professor;
const slot = req.body.slot;

// Fetch course duration based on the course ID
db.query("SELECT duration FROM courses WHERE course_id = ?", [course], (err, rows) => {
if (err) {
    console.log(err);
    res.status(500).send("Error occurred while fetching course duration.");
    return;
}

if (rows.length === 0) {
    res.status(404).send("Course not found.");
    return;
}

const courseDuration = rows[0].duration;

// Insert into summer table
db.query("INSERT INTO summer (User_id, course_id, slot) VALUES (?, ?, ?)", [professor, course, slot], (err, result) => {
    if (err) {
        console.log(err);
        res.status(500).send("Error occurred while inserting into summer table.");
        return;
    }

    const blocks = Array.from({ length: slot }, (_, i) => String.fromCharCode(65 + i)); // Generate blocks A, B, C, etc.
    let insertValues = [];

    blocks.forEach(block => {
        if (courseDuration === 5) {
            insertValues.push([result.insertId, block, 'ftf']);
            insertValues.push([result.insertId, block, 'online']);
            insertValues.push([result.insertId, block, 'lab']);
        } else if (courseDuration === 3) {
            insertValues.push([result.insertId, block, 'ftf']);
            insertValues.push([result.insertId, block, 'online']);
        }
    });

    console.log("Insert values:", insertValues);

    // Insert into summer_sched table
    if (insertValues.length > 0) {
        const placeholders = insertValues.map(() => "(?, ?, ?)").join(", ");
        const values = insertValues.flat();
        const queryString = `INSERT INTO summer_sched (id, block, type) VALUES ${placeholders}`;
        console.log("Generated SQL query:", queryString);
        
        db.query(queryString, values, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error occurred while inserting into summer_sched table.");
                return;
            }
            res.send("Data inserted successfully into both summer and summer_sched tables.");
        });
    } else {
        res.send("No data to insert into summer_sched table.");
    }
});
});
});

app.get("/manual/check/:professor/:course", (req, res) => {
const professor = req.params.professor;
const course = req.params.course;
db.query("SELECT * FROM summer WHERE User_id = ? AND course_id = ?", [professor, course], (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json({ exists: data.length > 0 });
});
});

app.delete('/manual/:id/delete', (req, res) => {
const id = req.params.id; // Corrected from req.params.id to req.params.id
db.query('DELETE FROM summer WHERE id = ?', [id], (err, data) => {
if(err) {
    return res.send(err);
}
return res.send(data);
});
});




app.get('/manual/display', (req, res) => {
db.query("SELECT s.*, c.course_code, c.course_name, u.fname, u.lname FROM summer s INNER JOIN courses c ON s.course_id = c.course_id INNER JOIN users u ON s.User_id = u.User_id", (err, result) => {
if (err) {
    console.error('Error fetching summer data: ', err);
    res.status(500).send('Internal server error');
} else {
    res.status(200).send(result);
}
});
});

app.get("/autogenetics", (req, res) => {
const sql = "SELECT * FROM specialization";
db.query(sql, (err, data) =>{
if(err){
  console.log(err);
  return res.json(err);
}
  return res.json(data);
});
});

app.get("/autogenetics/professors", (req, res) => {
let sql = `
SELECT s.User_id, u.fname, u.lname, u.role, r.*
FROM specialization AS s
INNER JOIN users AS u ON s.User_id = u.User_id
INNER JOIN role AS r ON u.role = r.role_id
GROUP BY s.User_id, u.fname, u.lname, u.role, r.role;
`;

db.query(sql, (err, professorsData) => {
if (err) {
return res.json(err);
} else {
return res.json(professorsData);
}
});
});

app.get("/autogenetics/courses/:userId", (req, res) => {
const userId = req.params.userId;
let sql = `
SELECT c.course_id, c.course_code, c.course_name, c.duration, c.online, c.ftf, c.lab
FROM courses AS c
WHERE c.course_id IN (
  SELECT DISTINCT s.course_id
  FROM specialization AS s
  WHERE s.User_id = ? );
`;
db.query(sql, [userId], (err, professorsData) => {
if (err) {
return res.json(err);
} else {
return res.json(professorsData);
}
});
});

app.get("/autogenetics/courses/", (req, res) => {
let sql = `SELECT * FROM courses
`;
db.query(sql, (err, coursesData) => {
if (err) {
return res.json(err);
} else {
return res.json(coursesData);
}
});
});

app.get("/autogenetics/block/:courseId", (req, res) => {
const courseId = req.params.courseId;
console.log('Received courseId:', courseId);

let sql = `Select count(*) as total_blocks FROM block_course_assignment WHERE course_id = ?; `;

db.query(sql, [courseId], (err, coursesData) => {
if (err) {
return res.json(err);
} else {
return res.json(coursesData);
}
});
});

app.get('/autogenetics/program-year-block/:courseId', (req, res) => {
const courseId = req.params.courseId;

const query =  `SELECT bc.*
FROM specialization s
INNER JOIN courses c ON s.course_id = c.course_id
INNER JOIN (
SELECT
course_id,
program,
year,
block
FROM block_course_assignment 
) bc ON c.course_id = bc.course_id
WHERE c.course_id = ?;
`;
db.query(query, [courseId], (err, results) => {
if (err) {
console.error('Error executing the query: ' + err);
res.status(500).send('Error fetching data from the database');
} else {
res.json(results);
}
});
});



app.get('/autogenetics/program-year-block', (req, res) => {

const query =  `SELECT count(*) from block_course_assignment;
`;
db.query(query,  (err, results) => {
if (err) {
console.error('Error executing the query: ' + err);
res.status(500).send('Error fetching data from the database');
} else {
res.json(results);
}
});
});

app.get('/autogenetics/room', (req, res) => {
const sql = "SELECT * FROM room";
db.query(sql, (err, data) =>{
if(err){
  console.log(err);
  return res.json(err);
}
  return res.json(data);
});
});
app.get('/autogenetics/rooms/:roomType', (req, res) => {
const { roomType } = req.params;
let sql;

if (roomType === 'Regular' || roomType === 'Laboratory') {
sql = `SELECT * FROM room WHERE type = '${roomType}'`;
} else {
sql = 'SELECT * FROM room WHERE type != "Laboratory"';
}

db.query(sql, (err, data) => {
if (err) {
console.log(err);
return res.json(err);
}
return res.json(data);
});
});

app.post("/save-academic-year", (req, res) => {
const startYear = req.body.startYear;
const endYear = req.body.endYear;
const semester = req.body.semester;

db.query("INSERT INTO academic_year (start, end, sem) VALUES (?, ?, ?)", [startYear, endYear, semester], (err, result) => {
if (err) {
console.error('Error saving academic year:', err);
res.status(500).send("Error saving academic year");
} else {
console.log('Academic year saved successfully');
res.status(200).send("Academic year saved successfully");
}
});
});

app.listen(process.env.PORT, () => {
console.log("Running...");
});