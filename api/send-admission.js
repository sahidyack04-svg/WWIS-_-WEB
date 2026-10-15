const FIELD_LABELS = [
  ['childName', 'Name of the Child'],
  ['dob', 'Date of Birth'],
  ['gender', 'Gender'],
  ['ageAsOnJune', 'Age as on 1st of June'],
  ['gradeSought', 'Grade to which admission is sought'],
  ['currentSchool', 'Current School, and Class'],
  ['siblingsCount', 'Siblings count'],
  ['admitSiblingsLater', 'Admit siblings later?'],
  ['ailments', 'Ailments / Learning disability'],
  ['ailmentsOther', 'Ailments / Learning disability (other)'],
  ['howKnown', 'How they learned about WWIS'],
  ['howKnownOther', 'How they learned about WWIS (other)'],
  ['timeSpentWithChild', 'Time spent with child'],
  ['topFeatures', 'Top features of a good school'],
  ['parentName', 'Parent Name'],
  ['parentQualification', 'Parent Qualification'],
  ['parentProfession', 'Parent Profession'],
  ['placeOfEmployment', 'Place of Employment'],
  ['address', 'Current Residential Address'],
  ['contactNumber', 'Contact Number'],
  ['email', 'Email ID'],
  ['remarks', 'Remarks'],
  ['followUpDetails', 'Follow-Up Details']
];

const ADMISSIONS_TO = 'rootadmin@wwistrichy.com';
const ADMISSIONS_FROM = 'WWIS Admissions <admissions@wwistrichy.com>';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isValidPhone(value) {
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEmailHtml(raw, childName) {
  const rows = FIELD_LABELS.map(function (pair) {
    const key = pair[0];
    const label = pair[1];
    let value = raw[key];
    if (value === undefined || value === null || value === '') return '';
    if (Array.isArray(value)) value = value.join(', ');
    return (
      '<tr><td style="padding:6px 10px;font-weight:600;border-bottom:1px solid #eee;white-space:nowrap;">' +
      escapeHtml(label) +
      '</td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' +
      escapeHtml(value) +
      '</td></tr>'
    );
  }).join('');

  return (
    '<div style="font-family:Arial,sans-serif;color:#1a1a1a;">' +
    '<h2 style="margin:0 0 14px;">New Admission Enquiry — ' + escapeHtml(childName) + '</h2>' +
    '<table style="border-collapse:collapse;width:100%;max-width:640px;">' + rows + '</table>' +
    '</div>'
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  let raw;
  try {
    raw = req.body;
  } catch (err) {
    res.status(400).json({ ok: false, error: 'Invalid request body.' });
    return;
  }
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch (err) {
      raw = {};
    }
  }
  raw = raw && typeof raw === 'object' ? raw : {};

  const childName = String(raw.childName || '').trim();
  const parentName = String(raw.parentName || '').trim();
  const email = String(raw.email || '').trim();
  const contactNumber = String(raw.contactNumber || '').trim();

  if (!childName || !parentName) {
    res.status(400).json({ ok: false, error: "Child's name and parent name are required." });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    return;
  }
  if (!isValidPhone(contactNumber)) {
    res.status(400).json({ ok: false, error: 'Please provide a valid contact number.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('send-admission: RESEND_API_KEY is not configured in this environment.');
    res.status(500).json({ ok: false, error: 'Email service is not configured. Please contact us directly.' });
    return;
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: ADMISSIONS_FROM,
        to: [ADMISSIONS_TO],
        reply_to: email,
        subject: 'New Admission Enquiry — ' + childName,
        html: buildEmailHtml(raw, childName)
      })
    });

    const data = await resendRes.json().catch(function () { return {}; });

    if (!resendRes.ok) {
      console.error('send-admission: Resend API error', resendRes.status, data);
      res.status(502).json({ ok: false, error: 'Could not send your enquiry right now. Please try again shortly.' });
      return;
    }

    res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('send-admission: request to Resend failed', err);
    res.status(502).json({ ok: false, error: 'Could not send your enquiry right now. Please try again shortly.' });
  }
};
