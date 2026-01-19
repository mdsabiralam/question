const processMessage = (state, message, context) => {
    const msg = message.toLowerCase();

    switch (state) {
        case 'IDLE':
            if (msg.includes('create') || msg.includes('question') || msg.includes('new')) {
                return {
                    nextState: 'ASKING_CLASS',
                    reply: 'Sure! Which class is this for? (e.g., Class 6, Class 10)'
                };
            }
            return { nextState: 'IDLE', reply: 'I can help you create a question paper. Type "create question" to start.' };

        case 'ASKING_CLASS':
            // Heuristic to detect class
            let cls = '';
            if (msg.includes('6')) cls = 'class-6';
            else if (msg.includes('7')) cls = 'class-7';
            else if (msg.includes('8')) cls = 'class-8';
            else if (msg.includes('9')) cls = 'class-9';
            else if (msg.includes('10')) cls = 'class-10';

            if (cls) {
                return {
                    nextState: 'ASKING_SUBJECT',
                    reply: `Got it (${cls}). Which subject? (Math, Science, Bengali...)`,
                    contextUpdates: { class: cls }
                };
            }
            return { nextState: 'ASKING_CLASS', reply: 'Please specify the class (6-10).' };

        case 'ASKING_SUBJECT':
            // Accept any non-trivial string as subject
            if (msg.length > 2) {
                return {
                    nextState: 'CONFIRMING_SAVE',
                    reply: `Okay, creating a ${context.class || 'Class'} ${msg} paper. Should I save this draft? (yes/no)`,
                    contextUpdates: { subject: msg }
                };
            }
            return { nextState: 'ASKING_SUBJECT', reply: 'Please enter a valid subject name.' };

        case 'CONFIRMING_SAVE':
            if (msg.includes('yes')) {
                // Here we would ideally call the ExamPaper save logic
                return {
                    nextState: 'IDLE',
                    reply: 'Draft saved successfully! (Mock Action)',
                    contextUpdates: {} // Clear context
                };
            }
            return { nextState: 'IDLE', reply: 'Cancelled. You can start over.' };

        default:
            return { nextState: 'IDLE', reply: 'Resetting conversation.' };
    }
};

module.exports = { processMessage };
