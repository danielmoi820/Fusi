const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch"); // Only needed if Node.js version <18

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports.handler = async function () {
  try {
    const sheetURL = "https://opensheet.elk.sh/YOUR_SHEET_ID/Sheet1";
    const response = await fetch(sheetURL);
    const rows = await response.json();

    console.log(rows);

    for (const row of rows) {
      const { data, error } = await supabase
        .from("applicants")
        .insert([
          {
            "Full name": row.name,
            "Email Address": row.email,
            "Phone number": row.phone,
            "College/University": row.university,
            "Course/Program": row.course,
            "Year of Study": row.year,
            "Portfolio GitHub": row.github,
            "Why should we select you": row.hire,
            "Upload Cv": row.upload,
            "Browse internship": row.internship,
          },
        ]);

      if (error) console.error(error);
      else console.log("Inserted row:", data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data synced successfully", rowsCount: rows.length }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};