document.addEventListener('DOMContentLoaded', function() {
    // 日記データを保存するオブジェクト
    let diaryData = JSON.parse(localStorage.getItem('diaryData')) || {};
    
    // 現在の日付情報
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    // DOM要素
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const diaryOverlay = document.getElementById('diaryOverlay');
    const diaryEntry = document.getElementById('diaryEntry');
    const diaryDateEl = document.getElementById('diaryDate');
    const diaryTextarea = document.getElementById('diaryTextarea');
    const saveDiaryBtn = document.getElementById('saveDiary');
    const closeDiaryBtn = document.getElementById('closeDiary');
    
    // 月の切り替えイベント
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // 日記モーダルを閉じる
    closeDiaryBtn.addEventListener('click', closeDiaryModal);
    diaryOverlay.addEventListener('click', closeDiaryModal);
    
    // 日記を保存
    saveDiaryBtn.addEventListener('click', () => {
        const selectedDate = diaryDateEl.dataset.date;
        const content = diaryTextarea.value.trim();
        
        if (content) {
            diaryData[selectedDate] = content;
            localStorage.setItem('diaryData', JSON.stringify(diaryData));
            
            // カレンダー上で日記がある日をマークする
            const dayEl = document.querySelector(`.calendar-day[data-date="${selectedDate}"]`);
            if (dayEl) {
                dayEl.classList.add('calendar-day-active');
            }
        } else {
            // 内容が空の場合は削除
            delete diaryData[selectedDate];
            localStorage.setItem('diaryData', JSON.stringify(diaryData));
            
            // カレンダー上のマークを削除
            const dayEl = document.querySelector(`.calendar-day[data-date="${selectedDate}"]`);
            if (dayEl) {
                dayEl.classList.remove('calendar-day-active');
            }
        }
        
        closeDiaryModal();
    });
    
    // カレンダーを描画する関数
    function renderCalendar() {
        // 月の表示を更新
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        currentMonthEl.textContent = `${currentYear}年${monthNames[currentMonth]}`;
        
        // カレンダーをクリア
        calendarEl.innerHTML = '';
        
        // 月の最初の日と最後の日を取得
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
        const firstDayOfWeek = firstDay.getDay();
        
        // 前月の空白セルを追加
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'aspect-square';
            calendarEl.appendChild(emptyCell);
        }
        
        // 日付セルを追加
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-day';
            dateCell.textContent = day;
            
            // 日付の文字列を作成（YYYY-MM-DD形式）
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dateCell.dataset.date = dateStr;
            
            // 日記がある日をマーク
            if (diaryData[dateStr]) {
                dateCell.classList.add('calendar-day-active');
            }
            
            // 日付クリックイベント
            dateCell.addEventListener('click', () => {
                // 日付の表示形式を日本語に変換
                const displayDate = `${currentYear}年${currentMonth + 1}月${day}日`;
                
                // 日記モーダルを表示
                diaryDateEl.textContent = displayDate;
                diaryDateEl.dataset.date = dateStr;
                diaryTextarea.value = diaryData[dateStr] || '';
                openDiaryModal();
            });
            
            calendarEl.appendChild(dateCell);
        }
    }
    
    // 日記モーダルを開く
    function openDiaryModal() {
        diaryEntry.classList.add('show');
        diaryOverlay.classList.add('show');
    }
    
    // 日記モーダルを閉じる
    function closeDiaryModal() {
        diaryEntry.classList.remove('show');
        diaryOverlay.classList.remove('show');
    }
    
    // 初期表示
    renderCalendar();
});
