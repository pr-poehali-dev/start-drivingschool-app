const URLS = {
  auth:       'https://functions.poehali.dev/99d6970b-09cc-410b-aed6-d4f7611be6c0',
  studentApi: 'https://functions.poehali.dev/d4610485-716c-44b5-8d9d-051489892951',
  adminApi:   'https://functions.poehali.dev/cdd6d02f-2846-4dc0-a969-4a0b69940aba',
  reviews:    'https://functions.poehali.dev/912d3dfb-2d6d-46d6-b608-3aef0ee3b77b',
};

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data === 'string') return JSON.parse(data) as T;
    return data as T;
  } catch {
    throw new Error(text);
  }
}

// AUTH
export const login = (login: string, password: string) =>
  req<{ id: number; name: string; role: string; login: string }>(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });

// STUDENT: SLOTS
export const getSlots = (studentId: number) =>
  req<{ id: number; date: string; time: string; status: string; instructor: string }[]>(
    `${URLS.studentApi}?resource=slots&student_id=${studentId}`
  );

export const bookSlot = (slotId: number, studentId: number) =>
  req(`${URLS.studentApi}?resource=slots`, {
    method: 'PUT',
    body: JSON.stringify({ slot_id: slotId, action: 'book', student_id: studentId }),
  });

export const cancelSlot = (slotId: number) =>
  req(`${URLS.studentApi}?resource=slots`, {
    method: 'PUT',
    body: JSON.stringify({ slot_id: slotId, action: 'cancel' }),
  });

// STUDENT: JOURNAL
export const getStudentJournal = (studentId: number) =>
  req<{ entries: { id: number; date: string; hours: number; grade: number; comment: string; instr: string }[]; totalHours: number }>(
    `${URLS.studentApi}?resource=journal&student_id=${studentId}`
  );

// REVIEWS
export const getReviews = () =>
  req<{ id: number; rating: number; text: string; date: string; name: string }[]>(URLS.reviews);

export const postReview = (studentId: number, rating: number, text: string) =>
  req(URLS.reviews, {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId, rating, text }),
  });

// ADMIN + INSTRUCTOR: GROUPS
export const getGroups = () =>
  req<{
    id: number; name: string; category: string; start: string; instructor: string; instructor_id: number;
    students: { id: number; name: string; phone: string; docs: Record<string, boolean>; totalHours: number; requiredHours: number }[];
  }[]>(`${URLS.adminApi}?resource=groups`);

// ADMIN: APPLICATIONS
export const getApplications = () =>
  req<{ id: number; name: string; phone: string; email: string; category: string; comment: string; status: string; date: string }[]>(
    `${URLS.adminApi}?resource=applications`
  );

export const postApplication = (data: { name: string; phone: string; email: string; category: string; comment: string }) =>
  req<{ id: number }>(`${URLS.adminApi}?resource=applications`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateApplicationStatus = (id: number, status: string) =>
  req(`${URLS.adminApi}?resource=applications`, {
    method: 'PUT',
    body: JSON.stringify({ id, status }),
  });

// ADMIN: DOCUMENTS
export const updateDocument = (studentId: number, doc: string, value: boolean) =>
  req(`${URLS.adminApi}?resource=documents`, {
    method: 'PUT',
    body: JSON.stringify({ student_id: studentId, doc, value }),
  });

// INSTRUCTOR: JOURNAL
export const getInstructorStudents = (instructorId: number) =>
  req<{ id: number; name: string; totalHours: number; requiredHours: number; journal: { id: number; date: string; hours: number; grade: number; comment: string }[] }[]>(
    `${URLS.adminApi}?resource=instructor-journal&instructor_id=${instructorId}`
  );

export const postJournalEntry = (data: { student_id: number; instructor_id: number; lesson_date: string; hours: number; grade: number; comment: string }) =>
  req<{ id: number }>(`${URLS.adminApi}?resource=instructor-journal`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ADMIN: USERS
export type UserRecord = {
  id: number; login: string; name: string; phone: string;
  email: string; account_type: string; created_at: string; group_name: string;
};

export const getUsers = () =>
  req<UserRecord[]>(`${URLS.adminApi}?resource=users`);

export const createUser = (data: {
  login: string; password: string; name: string;
  phone: string; email: string; account_type: string; group_id?: number | null;
}) =>
  req<{ id: number } | { error: string }>(`${URLS.adminApi}?resource=users`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateUser = (data: {
  id: number; name: string; phone: string; email: string; password?: string;
}) =>
  req(`${URLS.adminApi}?resource=users`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const archiveUser = (id: number) =>
  req(`${URLS.adminApi}?resource=users`, {
    method: 'POST',
    body: JSON.stringify({ action: 'archive', id }),
  });

export const getGroupsList = () =>
  req<{ id: number; name: string; category: string }[]>(
    `${URLS.adminApi}?resource=groups-list`
  );

// INSTRUCTOR: SCHEDULE
export const getInstructorSchedule = (instructorId: number) =>
  req<{ id: number; date: string; time: string; status: string; student: string | null }[]>(
    `${URLS.adminApi}?resource=schedule&instructor_id=${instructorId}`
  );