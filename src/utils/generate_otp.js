
function generateOtp() {
    // Generate a random number between 100000 and 999999
    const otp = Math.floor(1000000000 + Math.random() * 9000000000);
    return otp.toString();
}

// TO GENERATE SOME RANDOM PASSWORDS
function generateTempPassword(length = 12) {
    if (length < 4) {
        throw new Error("Password length should be at least 4 characters");
    }

    // Define character sets
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?';

    // Function to get a random character from a string
    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];

    // Ensure at least one character from each category
    let password = [
        getRandomChar(upperChars),
        getRandomChar(lowerChars),
        getRandomChar(digits),
        getRandomChar(specialChars)
    ];

    // Combine all character sets
    const allChars = upperChars + lowerChars + digits + specialChars;
    const remainingLength = length - password.length;
    
    for (let i = 0; i < remainingLength; i++) {
        password.push(getRandomChar(allChars));
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    // Convert array to string
    return password.join('');
}

module.exports = {
    generateOtp,
    generateTempPassword
}
  