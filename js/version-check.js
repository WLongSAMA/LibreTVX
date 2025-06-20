// 获取版本信息
async function fetchVersion(url, errorMessage, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(errorMessage);
    }
    return await response.text();
}

// 版本检查函数
async function checkForUpdates() {
    try {
        // 获取当前版本
        const currentVersion = await fetchVersion('/VERSION.txt', '获取当前版本失败', {
            cache: 'no-store'
        });

        // 清理版本字符串（移除可能的空格或换行符）
        const cleanCurrentVersion = currentVersion.trim();

        // 返回版本信息
        return {
            current: cleanCurrentVersion,
            currentFormatted: formatVersion(cleanCurrentVersion),
        };
    } catch (error) {
        console.error('版本检测出错:', error);
        throw error;
    }
}

// 格式化版本号为可读形式 (yyyyMMddhhmm -> yyyy-MM-dd hh:mm)
function formatVersion(versionString) {
    // 检测版本字符串是否有效
    if (!versionString) {
        return '未知版本';
    }

    // 清理版本字符串（移除可能的空格或换行符）
    const cleanedString = versionString.trim();

    // 格式化标准12位版本号
    if (cleanedString.length === 12) {
        const year = cleanedString.substring(0, 4);
        const month = cleanedString.substring(4, 6);
        const day = cleanedString.substring(6, 8);
        const hour = cleanedString.substring(8, 10);
        const minute = cleanedString.substring(10, 12);

        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    return cleanedString;
}

// 创建错误版本信息元素
function createErrorVersionElement(errorMessage) {
    const errorElement = document.createElement('p');
    errorElement.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';
    errorElement.innerHTML = `版本: <span class="text-amber-500">检测失败</span>`;
    errorElement.title = errorMessage;
    return errorElement;
}

// 添加版本信息到页脚
function addVersionInfoToFooter() {
    checkForUpdates().then(result => {
        if (!result) {
            // 如果版本检测失败，显示错误信息
            const versionElement = createErrorVersionElement();
            // 在页脚显示错误元素
            displayVersionElement(versionElement);
            return;
        }

        // 创建版本信息元素
        const versionElement = document.createElement('p');
        versionElement.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';

        // 添加当前版本信息
        versionElement.innerHTML = `版本: ${result.currentFormatted}`;

        // 显示版本元素
        displayVersionElement(versionElement);
    }).catch(error => {
        // 创建错误版本信息元素并显示
        const errorElement = createErrorVersionElement(`错误信息: ${error.message}`);
        displayVersionElement(errorElement);
    });
}

// 在页脚显示版本元素的辅助函数
function displayVersionElement(element) {
    // 获取页脚元素
    const footerElement = document.querySelector('.footer p.text-gray-500.text-sm');
    if (footerElement) {
        // 在原版权信息后插入版本信息
        footerElement.insertAdjacentElement('afterend', element);
    } else {
        // 如果找不到页脚元素，尝试在页脚区域最后添加
        const footer = document.querySelector('.footer .container');
        if (footer) {
            footer.querySelector('div').appendChild(element);
        }
    }
}

// 页面加载完成后添加版本信息
document.addEventListener('DOMContentLoaded', addVersionInfoToFooter);
