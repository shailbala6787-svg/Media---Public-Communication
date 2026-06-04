const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'pressReleases.js',
    from: `const { getAll, getOne, create, update, remove } = require('../controllers/pressReleaseController');`,
    to: `const { getPressReleases: getAll, getPressRelease: getOne, createPressRelease: create, updatePressRelease: update, deletePressRelease: remove } = require('../controllers/pressReleaseController');`
  },
  {
    file: 'publicNotices.js',
    from: `const { getAll, getOne, create, update, remove } = require('../controllers/publicNoticeController');`,
    to: `const { getPublicNotices: getAll, getPublicNotice: getOne, createPublicNotice: create, updatePublicNotice: update, deletePublicNotice: remove } = require('../controllers/publicNoticeController');`
  },
  {
    file: 'announcements.js',
    from: `const { getAll, getOne, create, update, remove } = require('../controllers/announcementController');`,
    to: `const { getAnnouncements: getAll, getAnnouncement: getOne, createAnnouncement: create, updateAnnouncement: update, deleteAnnouncement: remove } = require('../controllers/announcementController');`
  },
  {
    file: 'contacts.js',
    from: `const { getAll, getOne, create, update, reply, remove } = require('../controllers/contactController');`,
    to: `const { getContacts: getAll, getContact: getOne, createContact: create, updateContact: update, replyContact: reply, deleteContact: remove } = require('../controllers/contactController');`
  },
  {
    file: 'media.js',
    from: `const { getAll, getOne, upload: uploadMedia, update, remove } = require('../controllers/mediaController');`,
    to: `const { getMediaItems: getAll, uploadMedia, deleteMedia: remove } = require('../controllers/mediaController');\n// Mocks for missing controllers\nconst getOne = (req,res)=>res.status(404).send('Not implemented');\nconst update = (req,res)=>res.status(404).send('Not implemented');`
  },
  {
    file: 'users.js',
    from: `const { getAll, getOne, create, update, remove } = require('../controllers/userController');`,
    to: `const { getUsers: getAll, createUser: create, updateUser: update, deleteUser: remove } = require('../controllers/userController');\nconst getOne = (req,res)=>res.status(404).send('Not implemented');`
  }
];

replacements.forEach(({ file, from, to }) => {
  const p = path.join(__dirname, 'routes', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(p, content);
    console.log(`Fixed ${file}`);
  }
});
