import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { format, addHours } from 'date-fns';
import { SECRET } from '../../env.js';

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
      expiresIn: '48h',
      algorithm: 'HS256',
    }),

  getJWTExpirationTime: () => ({
    currentDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    oneHourAfterDateTime: format(addHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  }),

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
