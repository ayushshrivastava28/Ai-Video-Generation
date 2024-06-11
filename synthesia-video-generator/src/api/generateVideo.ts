const API_KEY = '746ee48b3c0121d39170d3c01757066e';
const BASE_URL = 'https://api.synthesia.io/v2';

// Function to create a video
export const createVideo = async (scriptText: string, title: string): Promise<string> => {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: API_KEY!
        },
        body: JSON.stringify({
            test: 'true',
            visibility: 'private',
            title: title,
            input: [
                {
                    avatarSettings: { horizontalAlign: 'center', scale: 1, style: 'rectangular', seamless: false },
                    backgroundSettings: {
                        videoSettings: {
                            shortBackgroundContentMatchMode: 'freeze',
                            longBackgroundContentMatchMode: 'trim'
                        }
                    },
                    scriptText: scriptText,
                    avatar: 'anna_costume1_cameraA',
                    background: 'green_screen'
                }
            ]
        })
    };

    const response = await fetch(`${BASE_URL}/videos`, options);
    if (!response.ok) {
        throw new Error('Daily limit is exceeded! Please try again after sometime.');
    }

    const data = await response.json();
    return data.id;
};

// Function to fetch video status
export const getVideoStatus = async (videoId: string) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY!
        }
    };

    const response = await fetch(`${BASE_URL}/videos/${videoId}`, options);
    if (!response.ok) {
        throw new Error('Error fetching video status');
    }

    return response.json();
};

// Function to download video
export const downloadVideo = async (downloadUrl: string) => {
    const response = await fetch(downloadUrl);

    if (!response.ok) {
        throw new Error('Error downloading video');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'video.mp4');
    document.body.appendChild(link);
    link.click();
};

// Function to fetch list of generated videos
export const fetchVideos = async (): Promise<any> => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY!
        }
    };

    const response = await fetch(`${BASE_URL}/videos?limit=20&offset=0`, options);
    if (!response.ok) {
        throw new Error('Error fetching videos');
    }

    return response.json();
};