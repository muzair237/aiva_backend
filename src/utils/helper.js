import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS, SECRET } from '../../env.js';
import OTPEmailTemp from './templates/verifyOTP.js';

export default {
  filterQuery: ({ query }) => ({
    page: query.page ? Number(query.page) : 1,
    itemsPerPage: query.itemsPerPage ? Number(query.itemsPerPage) : query.perPage ? Number(query.perPage) : 10,
    searchText:
      query.searchText !== 'null' && query.searchText !== 'undefined' && query.searchText ? query.searchText : '',
    startDate: query.startDate !== 'null' && query.startDate !== 'undefined' && query.startDate ? query.startDate : '',
    endDate: query.endDate !== 'null' && query.endDate !== 'undefined' && query.endDate ? query.endDate : '',
    filterText:
      query.filterText !== 'null' && query.filterText !== 'undefined' && query.filterText ? query.filterText : '',
    sort: query.sort && query.sort !== 'undefined' && query.sort !== 'null' ? query.sort : '',
    type: query.type && query.type !== 'undefined' && query.type !== 'null' && query.type !== 'all' ? query.type : '',
  }),

  pagination: (items, page, totalItems, itemsPerPage, getAll) => {
    items = items || [];
    page = page || 1;
    totalItems = totalItems || 0;
    itemsPerPage = itemsPerPage || 5;

    return {
      items,
      currentPage: page,
      hasNextPage: getAll === 'true' ? false : itemsPerPage * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage),
      totalItems,
    };
  },

  hashPassword: password => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
  },

  comparePassword: (password, hasedPassword) => bcrypt.compareSync(password, hasedPassword),

  generateJWTToken: payload =>
    jwt.sign(payload, SECRET, {
      expiresIn: '15d',
      algorithm: 'HS256',
    }),

  decryptToken: token => {
    const decrypted = jwtDecode(token);
    const iat = new Date(decrypted.iat * 1000);
    const exp = new Date(decrypted.exp * 1000);

    return { iat, exp };
  },

  generateOTP: () => {
    const length = 4;
    const charset = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      otp += charset[randomIndex];
    }

    return otp;
  },

  sendEmail: async (email, name, otp) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const message = OTPEmailTemp({ name, otp });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'OTP for Your Account',
      // eslint-disable-next-line max-len
      html: message,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getSorting: (sortingOrder, fieldName) => {
    switch (sortingOrder) {
      case 'asc':
        return { [fieldName]: 1 };
      case 'desc':
        return { [fieldName]: -1 };
      case 'latest':
        return { createdAt: -1 };
      case 'earliest':
        return { createdAt: 1 };
      default:
        return { created_at: -1 };
    }
  },
};
