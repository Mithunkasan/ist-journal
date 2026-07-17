import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { auth } from "@/auth";

const announcementsFilePath = path.join(process.cwd(), "announcements.json");

const defaultAnnouncements = [
  {
    date: "May 1, 2024",
    dateAr: "1 مايو 2024",
    title: "Call for Papers: Special Issue on AI in Healthcare",
    titleAr: "دعوة لتقديم الأبحاث: عدد خاص عن الذكاء الاصطناعي في الرعاية الصحية",
    content: "The IST Online Journal is pleased to announce a special issue focusing on the applications of Artificial Intelligence and Machine Learning in Healthcare systems. Submission deadline is July 30, 2024.",
    contentAr: "يسر مجلة IST الإلكترونية الإعلان عن عدد خاص يركز على تطبيقات الذكاء الاصطناعي والتعلم الآلي في أنظمة الرعاية الصحية. الموعد النهائي للتقديم هو 30 يوليو 2024."
  },
  {
    date: "April 15, 2024",
    dateAr: "15 أبريل 2024",
    title: "New Editorial Board Members Welcome",
    titleAr: "الترحيب بأعضاء هيئة التحرير الجدد",
    content: "We are thrilled to welcome Dr. Sarah Johnson and Prof. Michael Chen to our editorial board. Their expertise in Data Science and Cybersecurity will greatly benefit our peer-review process.",
    contentAr: "يسعدنا أن نرحب بالدكتورة سارة جونسون والبروفيسور مايكل تشين في هيئة التحرير لدينا. ستفيد خبرتهم في علوم البيانات والأمن السيبراني عملية مراجعة الأقران لدينا بشكل كبير."
  },
  {
    date: "January 10, 2024",
    dateAr: "10 يناير 2024",
    title: "Journal Awarded Higher Impact Factor",
    titleAr: "حصول المجلة على معامل تأثير أعلى",
    content: "We are proud to announce that our estimated Impact Factor for 2024 has increased to 7.97, reflecting the high quality and growing citations of the research published in our journal.",
    contentAr: "نفخر بالإعلان عن ارتفاع معامل التأثير المقدر لعام 2024 إلى 7.97، مما يعكس الجودة العالية والاقتباسات المتزايدة للأبحاث المنشورة في مجلتنا."
  }
];

function readAnnouncements() {
  try {
    if (!fs.existsSync(announcementsFilePath)) {
      fs.writeFileSync(announcementsFilePath, JSON.stringify(defaultAnnouncements, null, 2));
      return defaultAnnouncements;
    }
    const data = fs.readFileSync(announcementsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read announcements file", error);
    return defaultAnnouncements;
  }
}

function writeAnnouncements(data: any) {
  try {
    fs.writeFileSync(announcementsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write announcements file", error);
  }
}

export async function GET() {
  const data = readAnnouncements();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, titleAr, date, dateAr, content, contentAr } = body;
    if (!title || !content) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const currentAnnouncements = readAnnouncements();
    const newAnnouncement = {
      date: date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      dateAr: dateAr || new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
      title,
      titleAr: titleAr || title,
      content,
      contentAr: contentAr || content,
    };

    currentAnnouncements.unshift(newAnnouncement);
    writeAnnouncements(currentAnnouncements);

    return NextResponse.json(newAnnouncement);
  } catch (error) {
    console.error("Failed to create announcement", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
