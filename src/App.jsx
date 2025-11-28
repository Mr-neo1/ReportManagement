import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  Save,
  Server,
  Shield,
  Zap,
  Settings,
  Cloud,
  Loader,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import ScreenshotBox from './components/ScreenshotBox';
import SectionHeader from './components/SectionHeader';
import QuickNav from './components/QuickNav';
import PreviewModal from './components/PreviewModal';
import SettingsModal from './components/SettingsModal';
import {
  isAuthenticated,
  getBaseFolderId,
  createReportFolderStructure,
  uploadFileToDrive,
  sanitizeCycleName,
} from './utils/drive';
import {
  calculateDuration,
  formatIsoDateForDisplay,
  formatIsoDateLong,
  getCurrentTime,
} from './utils/time';

const DEFAULT_TEST_EMAILS = [
  { email: 'postal.mailtester1@gmail.com', time: '01:42 PM', quota: '', status: 'Everything Normal' },
  { email: 'postal.mailtester2@gmail.com', time: '01:42 PM', quota: '', status: 'Everything Normal' },
  { email: 'mtest.postal3@outlook.com', time: '01:42 PM', quota: '', status: 'Everything Normal' },
];

const TEST_STATUS_OPTIONS = ['Everything Normal', 'Spam Detected'];

const LOCAL_STORAGE_KEY = 'mailServerReport';
const PER_RUN_LIMIT = 100;

export default function App() {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportCycle, setReportCycle] = useState('');
  const [startTime, setStartTime] = useState('08:44 AM');
  const [endTime, setEndTime] = useState('');
  const [liveLogCheckTime, setLiveLogCheckTime] = useState('08:45 AM');
  const [runningStatusTime, setRunningStatusTime] = useState('08:45 AM');
  const [killScriptTime, setKillScriptTime] = useState('NA');
  const [scriptNote, setScriptNote] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [totalSentCount, setTotalSentCount] = useState('');
  const [testEmails, setTestEmails] = useState(DEFAULT_TEST_EMAILS);
  const [liveLogScreenshots, setLiveLogScreenshots] = useState([]);
  const [runningStatusScreenshots, setRunningStatusScreenshots] = useState([]);
  const [testMailScreenshots, setTestMailScreenshots] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showNav, setShowNav] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeValidation, setTimeValidation] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveMessage, setDriveMessage] = useState({ type: '', text: '' });

  const runtimeReference = useMemo(() => {
    if (endTime?.trim()) return endTime;
    if (killScriptTime && killScriptTime !== 'NA') return killScriptTime;
    return '';
  }, [endTime, killScriptTime]);

  const runtimeDuration = useMemo(() => {
    if (!startTime || !runtimeReference) return null;
    return calculateDuration(startTime, runtimeReference);
  }, [startTime, runtimeReference]);

  const runsNeeded = useMemo(() => {
    if (!dailyTarget) return 0;
    return Math.ceil(parseInt(dailyTarget, 10) / PER_RUN_LIMIT);
  }, [dailyTarget]);

  const parsedTotalSentToday = useMemo(
    () => (parseInt(totalSentCount, 10) > 0 ? parseInt(totalSentCount, 10) : 0),
    [totalSentCount]
  );

  const dailyAchievement = useMemo(() => {
    if (!dailyTarget) return 0;
    const target = parseInt(dailyTarget, 10);
    if (!target) return 0;
    return (parsedTotalSentToday / target) * 100;
  }, [dailyTarget, parsedTotalSentToday]);

  const completion = useMemo(() => {
    let completed = 0;
    const total = 11;
    if (startTime) completed++;
    if (endTime) completed++;
    if (liveLogCheckTime) completed++;
    if (runningStatusTime) completed++;
    if (dailyTarget) completed++;
    if (parsedTotalSentToday > 0) completed++;
    if (testEmails?.[0]?.email) completed++;
    if (liveLogScreenshots.length > 0) completed++;
    if (runningStatusScreenshots.length > 0) completed++;
    if (testMailScreenshots.length > 0) completed++;
    return Math.round((completed / total) * 100);
  }, [
    dailyTarget,
    endTime,
    liveLogCheckTime,
    liveLogScreenshots.length,
    runningStatusScreenshots.length,
    runningStatusTime,
    startTime,
    testEmails,
    testMailScreenshots.length,
    parsedTotalSentToday,
  ]);

  useEffect(() => {
    if (startTime && runtimeReference) {
      if (runtimeDuration === 'Invalid') {
        setTimeValidation('⚠️ End/Kill time is before start time!');
      } else {
        setTimeValidation('');
      }
    } else {
      setTimeValidation('');
    }
  }, [runtimeDuration, startTime, runtimeReference]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            reportDate,
            reportCycle,
            startTime,
            endTime,
            liveLogCheckTime,
            runningStatusTime,
            killScriptTime,
            scriptNote,
            dailyTarget,
            totalSentCount,
            testEmails,
            notes,
          })
        );
        alert('✓ Report saved locally!');
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setDarkMode((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    dailyTarget,
    endTime,
    killScriptTime,
    liveLogCheckTime,
    notes,
    reportCycle,
    reportDate,
    runningStatusTime,
    scriptNote,
    startTime,
    testEmails,
    totalSentCount,
  ]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items || !activeSection) return;
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file, activeSection);
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [activeSection]);

  const processImageFile = (file, section) => {
    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };
    reader.onload = (event) => {
      const screenshot = {
        name: file.name || `pasted-${Date.now()}.png`,
        data: event.target?.result,
        timestamp: getCurrentTime(),
      };
      if (section === 'liveLog') setLiveLogScreenshots((prev) => [...prev, screenshot]);
      if (section === 'runningStatus') setRunningStatusScreenshots((prev) => [...prev, screenshot]);
      if (section === 'testMail') setTestMailScreenshots((prev) => [...prev, screenshot]);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const addTestEmail = () =>
    setTestEmails((prev) => [
      ...prev,
      { email: '', time: getCurrentTime(), quota: '', status: 'Everything Normal' },
    ]);

  const updateTestEmail = (index, field, value) => {
    setTestEmails((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const removeTestEmail = (index) => {
    setTestEmails((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleScreenshotUpload = (e, section) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => processImageFile(file, section));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, section) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
    files.forEach((file) => processImageFile(file, section));
  };

  const removeScreenshot = (index, section) => {
    if (section === 'liveLog') {
      setLiveLogScreenshots((prev) => prev.filter((_, i) => i !== index));
    } else if (section === 'runningStatus') {
      setRunningStatusScreenshots((prev) => prev.filter((_, i) => i !== index));
    } else if (section === 'testMail') {
      setTestMailScreenshots((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const reorderScreenshot = (section, fromIndex, toIndex) => {
    const reorder = (arr) => {
      const result = [...arr];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    };
    if (section === 'liveLog') setLiveLogScreenshots((prev) => reorder(prev));
    if (section === 'runningStatus') setRunningStatusScreenshots((prev) => reorder(prev));
    if (section === 'testMail') setTestMailScreenshots((prev) => reorder(prev));
  };

  const setCurrentTime = (field) => {
    const time = getCurrentTime();
    if (field === 'start') setStartTime(time);
    if (field === 'liveLog') setLiveLogCheckTime(time);
    if (field === 'runningStatus') setRunningStatusTime(time);
    if (field === 'end') setEndTime(time);
    if (field === 'kill') setKillScriptTime(time);
  };

  const toggleSection = (sectionId) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowNav(false);
  };

  const generateWordDocBlob = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><style>body{font-family:Arial;font-size:11pt;margin:40px}h1{text-align:center;font-size:14pt;margin-bottom:20px}h2{font-size:12pt;margin-top:20px;margin-bottom:10px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{border:1px solid black;padding:8px;text-align:left;font-size:10pt}th{background-color:#f0f0f0;font-weight:bold}.screenshot{max-width:100%;margin:10px 0;border:1px solid #ccc}</style></head>
      <body>
        <h1>Daily Mail Server Operations Report</h1>
        <p>Date: ${formatIsoDateLong(reportDate)}</p>
        <p>Cycle / Window: ${reportCycle || 'Not specified'}</p>
        <h2>Script & Log Check:-</h2>
        <table><tr><th>Activity</th><th>Timing</th><th>Note</th></tr>
        <tr><td>Start</td><td>${startTime}</td><td>${scriptNote || ''}</td></tr>
        <tr><td>Live Log Check</td><td>${liveLogCheckTime}</td><td>${liveLogScreenshots.length > 0 ? `Screenshot at ${liveLogScreenshots[0].timestamp}` : ''}</td></tr>
        <tr><td>Running Status</td><td>${runningStatusTime}</td><td>${runningStatusScreenshots.length > 0 ? `Screenshot at ${runningStatusScreenshots[0].timestamp}` : ''}</td></tr>
        <tr><td>End Time</td><td>${endTime || '[PENDING]'}</td><td>${
          runtimeDuration && runtimeDuration !== 'Invalid' ? `Duration: ${runtimeDuration}` : ''
        }</td></tr>
        <tr><td>Kill Script</td><td>${killScriptTime}</td><td></td></tr></table>
        <h2>Email Delivery Metrics:-</h2>
        <table><tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Daily Target (24hrs)</td><td>${dailyTarget ? parseInt(dailyTarget, 10).toLocaleString() : '[PENDING]'} emails</td></tr>
        <tr><td>Per Run Limit</td><td>${PER_RUN_LIMIT} emails max</td></tr>
        <tr><td>Runs Needed</td><td>${runsNeeded} runs</td></tr>
        <tr><td>Total Sent Today</td><td>${parsedTotalSentToday.toLocaleString()} emails</td></tr>
        <tr><td>Daily Achievement</td><td>${dailyAchievement.toFixed(1)}%</td></tr></table>
        <h2>Test Mail Check:-</h2>
        <table><tr><th>Email Address</th><th>Timing</th><th>Email Quota</th><th>Spam Report / Note</th></tr>
        ${testEmails
          .map(
            (e) =>
              `<tr><td>${e.email}</td><td>${e.time}</td><td>${e.quota || 'N/A'}</td><td>${e.status}</td></tr>`
          )
          .join('')}</table>
        <h2>Screenshots:-</h2><h3>Mailbox Screenshots - No Spam/Junk</h3>
        ${testMailScreenshots.map((s, i) => `<img class="screenshot" src="${s.data}" alt="Mailbox ${i + 1}" />`).join('')}
        ${
          liveLogScreenshots.length > 0
            ? `<h3>Live Log Screenshots:</h3>${liveLogScreenshots
                .map((s) => `<img class="screenshot" src="${s.data}" />`)
                .join('')}`
            : ''
        }
        ${
          runningStatusScreenshots.length > 0
            ? `<h3>Running Status Screenshots:</h3>${runningStatusScreenshots
                .map((s) => `<img class="screenshot" src="${s.data}" />`)
                .join('')}`
            : ''
        }
        ${notes ? `<h2>Additional Notes:-</h2><p>${notes}</p>` : ''}
      </body></html>
    `;
    return new Blob([htmlContent], { type: 'application/msword' });
  };

  const downloadWordDoc = () => {
    const blob = generateWordDocBlob();
    const cyclePart = reportCycle ? `_${sanitizeCycleName(reportCycle)}` : '';
    const filename = `Mail_Report_${reportDate}${cyclePart}.doc`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadToDrive = async () => {
    if (!isAuthenticated()) {
      setDriveMessage({ type: 'error', text: 'Please sign in to Google Drive first (Settings → Google Drive Settings)' });
      setTimeout(() => setDriveMessage({ type: '', text: '' }), 5000);
      return;
    }

    if (!getBaseFolderId()) {
      setDriveMessage({ type: 'error', text: 'Please configure base folder in Settings' });
      setTimeout(() => setDriveMessage({ type: '', text: '' }), 5000);
      return;
    }

    if (!reportCycle) {
      setDriveMessage({ type: 'error', text: 'Please enter a Report Cycle before uploading' });
      setTimeout(() => setDriveMessage({ type: '', text: '' }), 5000);
      return;
    }

    setDriveUploading(true);
    setDriveMessage({ type: '', text: '' });

    try {
      // Create folder structure
      setDriveMessage({ type: 'info', text: 'Creating folder structure...' });
      const folderStructure = await createReportFolderStructure(reportDate, reportCycle);

      // Generate document
      const blob = generateWordDocBlob();
      const cyclePart = sanitizeCycleName(reportCycle);
      const filename = `Mail_Report_${reportDate}_${cyclePart}.doc`;

      // Upload to Drive
      setDriveMessage({ type: 'info', text: 'Uploading report to Drive...' });
      const result = await uploadFileToDrive(blob, filename, folderStructure.cycleFolderId);

      setDriveMessage({
        type: 'success',
        text: `✓ Report uploaded successfully! Path: ${folderStructure.path}/${filename}`,
      });

      // Optionally open in Drive
      if (result.webViewLink) {
        setTimeout(() => {
          if (confirm('Report uploaded! Open in Google Drive?')) {
            window.open(result.webViewLink, '_blank');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Drive upload error:', error);
      setDriveMessage({ type: 'error', text: error.message || 'Upload failed. Please try again.' });
    } finally {
      setDriveUploading(false);
      setTimeout(() => setDriveMessage({ type: '', text: '' }), 8000);
    }
  };

  const handleDownloadAndUpload = async () => {
    // Download locally first
    downloadWordDoc();

    // Then upload to Drive if authenticated
    if (isAuthenticated() && getBaseFolderId() && reportCycle) {
      await handleUploadToDrive();
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText('Report copied!');
    alert('✓ Report text copied!');
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        reportDate,
        reportCycle,
        startTime,
        endTime,
        liveLogCheckTime,
        runningStatusTime,
        killScriptTime,
        scriptNote,
        dailyTarget,
        totalSentCount,
        testEmails,
        notes,
      })
    );
    alert('✓ Report saved locally!');
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
      } transition-colors duration-300 pb-20`}
    >
      <QuickNav
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showNav={showNav}
        setShowNav={setShowNav}
        scrollToSection={scrollToSection}
        onSettingsClick={() => setShowSettings(true)}
      />

      <PreviewModal previewImage={previewImage} setPreviewImage={setPreviewImage} />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div
          className={`${
            darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
          } rounded-3xl shadow-2xl p-6 md:p-8 mb-8 text-white`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
                <Server className="w-8 md:w-10 h-8 md:h-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black">Mail Server Operations</h1>
                <p className="text-indigo-100 mt-1 text-sm md:text-base">Daily Monitoring Dashboard</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg px-4 md:px-6 py-3 rounded-2xl flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-sm md:text-base">
                {formatIsoDateForDisplay(reportDate)}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Completion</span>
              <span className="text-sm font-bold">{completion}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {timeValidation && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{timeValidation}</span>
          </div>
        )}

        {runtimeDuration && runtimeDuration !== 'Invalid' && (
          <div
            className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
            } border-2 rounded-2xl p-4 mb-6 flex items-center gap-3`}
          >
            <Clock className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Runtime
              </p>
              <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                {runtimeDuration}
              </p>
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Report Date
              </h2>
            </div>
            <button
              onClick={() => setReportDate(new Date().toISOString().split('T')[0])}
              className="text-xs bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow"
            >
              Today
            </button>
          </div>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className={`w-full px-5 py-3 border-2 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
            } rounded-xl focus:ring-4 focus:ring-indigo-200 text-lg font-semibold`}
          />
          <div className="mt-4">
            <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Report Cycle / Window
            </label>
            <input
              type="text"
              value={reportCycle}
              onChange={(e) => setReportCycle(e.target.value)}
              placeholder="e.g., Cycle 1 (12 AM - 6 AM)"
              className={`w-full px-4 py-3 border-2 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
              } rounded-xl focus:ring-3 focus:ring-indigo-200 font-semibold`}
            />
          </div>
        </div>

        <div
          id="script"
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 md:p-8 mb-8`}
        >
          <SectionHeader
            id="script-section"
            title="Script & Log Check"
            Icon={Clock}
            iconColor="from-green-500 to-emerald-600"
            darkMode={darkMode}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          {!collapsedSections['script-section'] && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Start Time', value: startTime, setter: setStartTime, field: 'start' },
                  { label: 'Live Log Check', value: liveLogCheckTime, setter: setLiveLogCheckTime, field: 'liveLog' },
                  {
                    label: 'Running Status',
                    value: runningStatusTime,
                    setter: setRunningStatusTime,
                    field: 'runningStatus',
                  },
                  { label: 'End Time', value: endTime, setter: setEndTime, field: 'end' },
                  { label: 'Kill Script', value: killScriptTime, setter: setKillScriptTime, field: 'kill' },
                  { label: 'Note', value: scriptNote, setter: setScriptNote },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } p-4 rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}
                  >
                    <label
                      className={`block text-sm font-bold mb-2 flex justify-between ${
                        darkMode ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                      {item.field && (
                        <button
                          onClick={() => setCurrentTime(item.field)}
                          className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-bold"
                        >
                          Now
                        </button>
                      )}
                    </label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => item.setter(e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                      } rounded-lg focus:ring-3 focus:ring-indigo-200 font-semibold`}
                      placeholder={item.label}
                    />
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ScreenshotBox
                  section="liveLog"
                  screenshots={liveLogScreenshots}
                  title="Live Log"
                  desc="Screenshots with timestamp"
                  Icon={Zap}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  darkMode={darkMode}
                  uploadProgress={uploadProgress}
                  handleScreenshotUpload={handleScreenshotUpload}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  reorderScreenshot={reorderScreenshot}
                  removeScreenshot={removeScreenshot}
                  setPreviewImage={setPreviewImage}
                />
                <ScreenshotBox
                  section="runningStatus"
                  screenshots={runningStatusScreenshots}
                  title="Running Status"
                  desc="Status screenshots"
                  Icon={CheckCircle2}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  darkMode={darkMode}
                  uploadProgress={uploadProgress}
                  handleScreenshotUpload={handleScreenshotUpload}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  reorderScreenshot={reorderScreenshot}
                  removeScreenshot={removeScreenshot}
                  setPreviewImage={setPreviewImage}
                />
              </div>
            </>
          )}
        </div>

        <div
          id="metrics"
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 md:p-8 mb-8`}
        >
          <SectionHeader
            id="metrics-section"
            title="Email Delivery Metrics"
            Icon={BarChart3}
            iconColor="from-blue-500 to-indigo-600"
            darkMode={darkMode}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          {!collapsedSections['metrics-section'] && (
            <>
              <div className="grid md:grid-cols-3 gap-5 mb-6">
                <div
                  className={`${
                    darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                  } p-5 rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}
                >
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Daily Target (24hrs)
                  </label>
                  <input
                    type="number"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(e.target.value)}
                    className={`w-full px-4 py-3 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-blue-300'
                    } rounded-lg focus:ring-3 focus:ring-blue-200 text-lg font-bold`}
                    placeholder="240"
                  />
                </div>
                <div
                  className={`${
                    darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'
                  } p-5 rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-purple-200'}`}
                >
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Per Run Limit
                  </label>
                  <div
                    className={`w-full px-4 py-3 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-purple-300 bg-white'
                    } rounded-lg text-lg font-bold text-center`}
                  >
                    {PER_RUN_LIMIT} emails max
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-green-50 to-emerald-50'
                  } p-5 rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-green-200'}`}
                >
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Runs Needed
                  </label>
                  <div
                    className={`w-full px-4 py-3 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-green-300 bg-white'
                    } rounded-lg text-lg font-bold text-center`}
                  >
                    {runsNeeded > 0 ? `${runsNeeded} runs` : '--'}
                  </div>
                </div>
              </div>
              <div
                className={`${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                } rounded-2xl p-6 border-2 mb-6`}
              >
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Total Sent Today
                </label>
                <input
                  type="number"
                  value={totalSentCount}
                  onChange={(e) => setTotalSentCount(e.target.value)}
                  className={`w-full px-4 py-3 border-2 ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                  } rounded-lg focus:ring-3 focus:ring-green-200 text-lg font-bold`}
                  placeholder="Enter total emails sent today"
                />
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tip: enter the combined volume from all runs or batches for the day.
                </p>
              </div>
              {(dailyTarget || parsedTotalSentToday > 0) && (
                <div
                  className={`${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  } rounded-2xl p-6 border-2`}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Total Sent Today
                      </p>
                      <p className={`text-4xl font-black ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                        {parsedTotalSentToday.toLocaleString()}
                        {dailyTarget && (
                          <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-2`}>
                            / {parseInt(dailyTarget, 10).toLocaleString()} emails
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Daily Achievement
                      </p>
                      <div className="flex items-center gap-4">
                        <p className={`text-4xl font-black ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                          {dailyAchievement.toFixed(1)}%
                        </p>
                        {dailyAchievement >= 100 && (
                          <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">🎯 Target Met!</div>
                        )}
                      </div>
                      <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(dailyAchievement, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div
          id="testmail"
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 md:p-8 mb-8`}
        >
          <SectionHeader
            id="testmail-section"
            title="Test Mail Check"
            Icon={Mail}
            iconColor="from-purple-500 to-pink-600"
            darkMode={darkMode}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          {!collapsedSections['testmail-section'] && (
            <>
              {testEmails.map((email, i) => (
                <div
                  key={`test-email-${i}`}
                  className={`grid md:grid-cols-5 gap-3 mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl`}
                >
                  <input
                    type="email"
                    value={email.email}
                    onChange={(e) => updateTestEmail(i, 'email', e.target.value)}
                    className={`px-3 py-2 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                    } rounded-lg focus:border-purple-500 text-sm font-semibold`}
                    placeholder="email@example.com"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={email.time}
                      onChange={(e) => updateTestEmail(i, 'time', e.target.value)}
                      className={`px-3 py-2 border-2 ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                      } rounded-lg focus:border-purple-500 text-sm font-semibold flex-1`}
                      placeholder="01:42 PM"
                    />
                    <button
                      type="button"
                      onClick={() => updateTestEmail(i, 'time', getCurrentTime())}
                      className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg font-bold"
                    >
                      Now
                    </button>
                  </div>
                  <input
                    type="number"
                    value={email.quota}
                    onChange={(e) => updateTestEmail(i, 'quota', e.target.value)}
                    className={`px-3 py-2 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                    } rounded-lg focus:border-purple-500 text-sm font-semibold`}
                    placeholder="Quota"
                  />
                  <select
                    value={email.status}
                    onChange={(e) => updateTestEmail(i, 'status', e.target.value)}
                    className={`px-3 py-2 border-2 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                    } rounded-lg focus:border-purple-500 text-sm font-semibold`}
                  >
                    {TEST_STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={addTestEmail}
                      className="flex-1 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg"
                    >
                      +
                    </button>
                    {testEmails.length > 1 && (
                      <button
                        onClick={() => removeTestEmail(i)}
                        className="flex-1 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold text-lg"
                      >
                        −
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <ScreenshotBox
                  section="testMail"
                  screenshots={testMailScreenshots}
                  title="Mailbox Screenshots - No Spam/Junk"
                  desc="Inbox screenshots showing no spam"
                  Icon={Shield}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  darkMode={darkMode}
                  uploadProgress={uploadProgress}
                  handleScreenshotUpload={handleScreenshotUpload}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  reorderScreenshot={reorderScreenshot}
                  removeScreenshot={removeScreenshot}
                  setPreviewImage={setPreviewImage}
                />
              </div>
            </>
          )}
        </div>

        <div
          id="notes"
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 md:p-8 mb-8`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Additional Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border-2 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'
            } rounded-xl focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500`}
            placeholder="Any issues, observations, or additional information..."
          />
        </div>

        {/* Drive Status Message */}
        {driveMessage.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              driveMessage.type === 'error'
                ? 'bg-red-100 text-red-700 border-2 border-red-300'
                : driveMessage.type === 'success'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            }`}
          >
            {driveMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : driveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Loader className="w-5 h-5 animate-spin" />
            )}
            <span className="font-semibold flex-1">{driveMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleCopyReport}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Mail className="w-6 h-6" />
            Copy Report
          </button>
          <button
            onClick={downloadWordDoc}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Download className="w-6 h-6" />
            Download Word
          </button>
          <button
            onClick={handleUploadToDrive}
            disabled={driveUploading || !isAuthenticated() || !getBaseFolderId()}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {driveUploading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Cloud className="w-6 h-6" />
                Upload to Drive
              </>
            )}
          </button>
          <button
            onClick={handleSaveDraft}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Save className="w-6 h-6" />
            Save Draft
          </button>
        </div>

        <div
          className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          } border-2 rounded-2xl p-6`}
        >
          <h3 className={`font-bold mb-3 text-lg ${darkMode ? 'text-white' : 'text-blue-900'}`}>💡 Features:</h3>
          <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'} space-y-2`}>
            <li>• <strong>Validation:</strong> Warns if end time is before start time</li>
            <li>• <strong>Auto-calculate:</strong> Runtime duration automatically calculated</li>
            <li>• <strong>Screenshots:</strong> Drag to reorder, click to preview, hover to delete</li>
            <li>• <strong>Bulk upload:</strong> Progress indicator shows upload status</li>
            <li>• <strong>Dark mode:</strong> Toggle with button or Ctrl+D</li>
            <li>• <strong>Collapsible sections:</strong> Click section headers to collapse/expand</li>
            <li>• <strong>Quick navigation:</strong> Use menu button (top-right) to jump to sections</li>
            <li>• <strong>Keyboard shortcuts:</strong> Ctrl+S to save draft locally</li>
            <li>• <strong>Progress indicator:</strong> Shows completion percentage in header</li>
            <li>• <strong>Mobile responsive:</strong> Optimized for all screen sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

