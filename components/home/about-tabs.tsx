import * as React from "react";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLanguage } from "@/lib/LanguageContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography sx={{ lineHeight: 2 }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AboutTabs() {
  const [value, setValue] = React.useState(0);
  const { t, lang } = useLanguage();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="about tabs"
          variant="scrollable"
          sx={{
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& .Mui-selected": {
              color: "#006400 !important",
              fontWeight: 500,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#006400",
            },
          }}
        >
          <Tab label={lang === "en" ? "Contribute" : "المساهمة"} {...a11yProps(0)} />
          <Tab label={lang === "en" ? "Why Contribute?" : "لماذا تساهم؟"} {...a11yProps(1)} />
          <Tab label={lang === "en" ? "Submission Guidelines" : "إرشادات التقديم"} {...a11yProps(2)} />
          <Tab label={lang === "en" ? "Join Us" : "انضم إلينا"} {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {lang === "en" 
          ? "At IST Online Journal, we recognize that the true essence of academic discourse lies in the contributions of individuals like you, the authors, whose insights and research endeavors propel the field of Information Science and Technology (IST) forward. We invite you to be an integral part of our vibrant community by sharing your expertise, discoveries, and perspectives with fellow scholars, researchers, and enthusiasts worldwide."
          : "في مجلة IST الإلكترونية، ندرك أن الجوهر الحقيقي للخطاب الأكاديمي يكمن في مساهمات أفراد مثلك، المؤلفين، الذين تدفع رؤاهم ومساعيهم البحثية مجال علوم وتقنية المعلومات إلى الأمام. ندعوك لتكون جزءاً لا يتجزأ من مجتمعنا النابض بالحياة من خلال مشاركة خبراتك واكتشافاتك ووجهات نظرك مع زملائك العلماء والباحثين والمتحمسين في جميع أنحاء العالم."}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            listStyle: "decimal",
            paddingLeft: lang === "en" ? "50px" : "0",
            paddingRight: lang === "ar" ? "50px" : "0",
          }}
        >
          <li>
            {lang === "en" ? "Gain visibility and recognition for your research within the global IST community." : "احصل على رؤية وتقدير لأبحاثك داخل مجتمع تقنية المعلومات العالمي."}
          </li>
          <li>
            {lang === "en" ? "Make a meaningful impact by sharing your findings and insights with a diverse audience of academics, professionals, and enthusiasts." : "قم بإحداث تأثير هادف من خلال مشاركة نتائجك ورؤاك مع جمهور متنوع من الأكاديميين والمهنيين والمتحمسين."}
          </li>
          <li>
            {lang === "en" ? "Foster interdisciplinary collaboration and exchange ideas with fellow researchers, sparking new avenues of inquiry and discovery." : "عزز التعاون متعدد التخصصات وتبادل الأفكار مع زملائك الباحثين، مما يثير آفاقاً جديدة للبحث والاكتشاف."}
          </li>
          <li>
            {lang === "en" ? "Whether you're submitting a research paper, proposing a project, or initiating a discussion, there are various avenues through which you can contribute to IST Online Journal." : "سواء كنت تقدم ورقة بحثية، أو تقترح مشروعاً، أو تبدأ نقاشاً، فهناك طرق مختلفة يمكنك من خلالها المساهمة في مجلة IST الإلكترونية."}
          </li>
        </ul>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {lang === "en"
          ? "To ensure the quality and integrity of our content, we adhere to strict submission guidelines. Before submitting your work, please review our guidelines to familiarize yourself with our formatting requirements, citation styles, and editorial policies. Our editorial team is committed to providing constructive feedback and guidance throughout the submission and review process, ensuring a seamless and rewarding experience for authors."
          : "لضمان جودة ونزاهة محتوانا، نلتزم بإرشادات تقديم صارمة. قبل تقديم عملك، يرجى مراجعة إرشاداتنا للتعرف على متطلبات التنسيق وأنماط الاقتباس والسياسات التحريرية لدينا. يلتزم فريق التحرير لدينا بتقديم ملاحظات وإرشادات بناءة طوال عملية التقديم والمراجعة، مما يضمن تجربة سلسة ومجزية للمؤلفين."}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {lang === "en"
          ? "Embark on a journey of intellectual exploration and collaboration by becoming a contributor to IST Online Journal. Your contributions play a vital role in shaping the future of information science and technology, driving innovation, and creating positive change in the digital age. We look forward to welcoming you as a valued member of our community. Together, let's push the boundaries of knowledge and inspire the next generation of IST leaders."
          : "انطلق في رحلة استكشاف وتعاون فكري من خلال أن تصبح مساهماً في مجلة IST الإلكترونية. تلعب مساهماتك دوراً حيوياً في تشكيل مستقبل علوم وتقنية المعلومات، ودفع عجلة الابتكار، وإحداث تغيير إيجابي في العصر الرقمي. نتطلع إلى الترحيب بك كعضو قيم في مجتمعنا. معاً، دعونا ندفع حدود المعرفة ونلهم الجيل القادم من قادة تقنية المعلومات."}
      </CustomTabPanel>
    </Box>
  );
}
