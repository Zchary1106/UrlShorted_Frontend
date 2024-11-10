import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputLabel } from '@mui/material';

const REQUEST_URL = 'http://hb.frp.one:50451/zx/create-short';

const CenteredInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleClear = () => {
    setInputValue('');
    setDisplayText('');
  };

  const handleConfirm = async () => {
    if (!inputValue)
    {
        alert("Please iinput your url");
        return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const body = {
        expiresDate: formattedDate,
        longUrl: inputValue
    };

    try {
        const response = await fetch(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            setDisplayText('Failed, please try again');
            return;
        }

        const data = await response.text();
        console.log(data)
        setDisplayText(data || '');
    } catch (error) {
        console.error('Error:', error);
        setDisplayText('Failed, please try again');
    }
};

    // const handleCopy = () => {
    //     navigator.clipboard.writeText(displayText).then(
    //     () => {
    //         alert('Text copied to clipboard!');
    //     },
    //     (err) => {
    //         console.error('Failed to copy text: ', err);
    //     }
    //     );
    // };

    const handleCopy = () => {
        if (!displayText)
        {
            alert('Nothing to copy, please try it again.');
            return;
        }
        // 检查 navigator.clipboard 是否存在
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // 使用现代 API 进行复制
          navigator.clipboard.writeText(displayText).then(
            () => {
              alert('Text copied to clipboard!');
            },
            (err) => {
              console.error('Failed to copy text: ', err);
              fallbackCopy(); // 调用回退方法
            }
          );
        } else {
          fallbackCopy();
        }
      };
      
      const fallbackCopy = () => {
        const textArea = document.createElement('textarea');
        textArea.value = displayText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            alert('Text copied to clipboard!');
          } else {
            console.error('Fallback: Copy command was unsuccessful');
          }
        } catch (err) {
          console.error('Fallback: Unable to copy', err);
        }
        document.body.removeChild(textArea); 
      };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <InputLabel style={{ marginBottom: '30px', fontSize: '2.25rem', color: 'black' }}>Url Shorted:</InputLabel>
      <TextField
        label="Please input your url"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: '16px', width: '620px' }}
        placeholder="Please input your url"
      />
      <Box>
        <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginRight: '10px' }}>
          Confirm
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Remove
        </Button>
      </Box>
      <InputLabel style={{ marginTop: '30px', fontSize: '1.02rem', color: 'black'  }}>The short url has been generated by origin url:</InputLabel>
      <Box
        border={1}
        borderColor="grey.400"
        borderRadius={4}
        padding={2}
        marginTop="20px"
        bgcolor="#fff"
        width={600}
        height={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h5">
          {displayText}
        </Typography>
      </Box>
      <Box>
      <Button variant="contained" color="primary" onClick={handleCopy} style={{ marginRight: '10px', marginTop: '30px' }}>
          Copy to clipboard
        </Button>
      </Box>
    </Box>
  );
};

export default CenteredInput;