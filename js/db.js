/* ============================================
   SchoolDesk — IndexedDB Database Layer
   ============================================ */

class SchoolDB {
  constructor() {
    this.dbName = 'SchoolDeskDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Students store
        if (!db.objectStoreNames.contains('students')) {
          const store = db.createObjectStore('students', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('class', 'class', { unique: false });
          store.createIndex('section', 'section', { unique: false });
        }

        // Teachers store
        if (!db.objectStoreNames.contains('teachers')) {
          const store = db.createObjectStore('teachers', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('subject', 'subject', { unique: false });
        }

        // Parents store
        if (!db.objectStoreNames.contains('parents')) {
          const store = db.createObjectStore('parents', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('fatherName', 'fatherName', { unique: false });
        }

        // Fees store
        if (!db.objectStoreNames.contains('fees')) {
          const store = db.createObjectStore('fees', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // ─── Generic CRUD helpers ────────────────────

  _add(storeName, data) {
    return new Promise((resolve, reject) => {
      data.id = generateId();
      data.createdAt = new Date().toISOString();
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(data.id);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  _get(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  _getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  _update(storeName, id, data) {
    return new Promise(async (resolve, reject) => {
      const existing = await this._get(storeName, id);
      if (!existing) return reject(new Error('Record not found'));
      const updated = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt };
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(updated);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  _delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  _getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // ─── Students ────────────────────────────────

  async addStudent(data) { return this._add('students', data); }
  async getStudent(id) { return this._get('students', id); }
  async getAllStudents() { return this._getAll('students'); }
  async updateStudent(id, data) { return this._update('students', id, data); }
  async deleteStudent(id) { return this._delete('students', id); }

  // ─── Teachers ────────────────────────────────

  async addTeacher(data) { return this._add('teachers', data); }
  async getTeacher(id) { return this._get('teachers', id); }
  async getAllTeachers() { return this._getAll('teachers'); }
  async updateTeacher(id, data) { return this._update('teachers', id, data); }
  async deleteTeacher(id) { return this._delete('teachers', id); }

  // ─── Parents ─────────────────────────────────

  async addParent(data) { return this._add('parents', data); }
  async getParent(id) { return this._get('parents', id); }
  async getAllParents() { return this._getAll('parents'); }
  async updateParent(id, data) { return this._update('parents', id, data); }
  async deleteParent(id) { return this._delete('parents', id); }

  async getParentByStudent(studentId) {
    const parents = await this._getByIndex('parents', 'studentId', studentId);
    return parents.length > 0 ? parents[0] : null;
  }

  // ─── Fees ────────────────────────────────────

  async addFee(data) { return this._add('fees', data); }
  async getFee(id) { return this._get('fees', id); }
  async getAllFees() { return this._getAll('fees'); }
  async updateFee(id, data) { return this._update('fees', id, data); }
  async deleteFee(id) { return this._delete('fees', id); }

  async getFeesByStudent(studentId) {
    return this._getByIndex('fees', 'studentId', studentId);
  }

  // ─── Statistics ──────────────────────────────

  async getStats() {
    const students = await this.getAllStudents();
    const teachers = await this.getAllTeachers();
    const fees = await this.getAllFees();

    let totalCollected = 0;
    let totalPending = 0;

    fees.forEach(fee => {
      const amount = Number(fee.amount) || 0;
      if (fee.status === 'paid') {
        totalCollected += amount;
      } else {
        totalPending += amount;
      }
    });

    // Build recent activity from all stores
    const activities = [];

    students.forEach(s => {
      activities.push({
        type: 'student',
        text: `New student "${s.name}" added`,
        time: s.createdAt
      });
    });

    teachers.forEach(t => {
      activities.push({
        type: 'teacher',
        text: `Teacher "${t.name}" added`,
        time: t.createdAt
      });
    });

    fees.forEach(f => {
      const statusText = f.status === 'paid' ? 'paid' : 'recorded';
      activities.push({
        type: 'fee',
        text: `Fee ${formatCurrency(f.amount)} ${statusText} (${f.feeType})`,
        time: f.createdAt
      });
    });

    // Sort by time descending and take last 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivity = activities.slice(0, 10);

    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalCollected,
      totalPending,
      recentActivity
    };
  }

  // ─── Export / Import ─────────────────────────

  async exportData() {
    const data = {
      students: await this.getAllStudents(),
      teachers: await this.getAllTeachers(),
      parents: await this.getAllParents(),
      fees: await this.getAllFees(),
      exportedAt: new Date().toISOString(),
      version: 1
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonString) {
    const data = JSON.parse(jsonString);
    if (!data.students || !data.teachers || !data.parents || !data.fees) {
      throw new Error('Invalid backup file format');
    }

    await this.clearAll();

    const putAll = (storeName, items) => {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach(item => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    };

    await putAll('students', data.students);
    await putAll('teachers', data.teachers);
    await putAll('parents', data.parents);
    await putAll('fees', data.fees);
  }

  async clearAll() {
    const storeNames = ['students', 'teachers', 'parents', 'fees'];
    for (const storeName of storeNames) {
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
      });
    }
  }
}

// Global singleton
const db = new SchoolDB();
