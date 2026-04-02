import { getGuestQuizCount } from '@/utils/guestLimit';

type StartQuizParams = {
    isAuthenticated: boolean;
    quiz: any;
    id: string;
    router: any;
    services: any;
    setClick: (val: boolean) => void;
    setReached: (val: number) => void;
    setShowLimitModal: (val: boolean) => void;
};

export async function handleStartQuiz({
    isAuthenticated,
    quiz,
    id,
    router,
    services,
    setClick,
    setReached,
    setShowLimitModal,
}: StartQuizParams) {
    try {
        let reached = 0;
        let attempt = null;
        setClick(true)
        console.log(`click to start the click`);

        // 🔒 Guest logic
        if (!isAuthenticated) {
            const balance = await getGuestQuizCount();
            reached = balance;
            setReached(balance);
            console.log(`get current balance: `, reached)
            if (balance >= 3) {
                setClick(false);
                setShowLimitModal(true);
                console.log('Guest reached the limit');
                return;
            }

            console.log('Guest is free to play', balance);
        }else{
            
            // 🔐 Premium protection
            if (quiz.isPremium && !isAuthenticated) {
                console.log(`Quiz is premium: `, quiz.isPremium);
                setClick(false);
                router.push({
                    pathname: '/login',
                    params: {
                        message:
                            "Connectez-vous pour continuer, vous n'avez plus d'essais gratuits.",
                    },
                });
                return;
            }
    
            // 🚀 Start quiz
            attempt = await services?.quiz?.startQuiz(id);
            console.log(`attempt response: `, attempt)
    
            if (!attempt._id) {
                setClick(false);
                throw new Error('Invalid attempt response');
            }

        }

        router.push({
          pathname: `/quiz/${quiz.id}/play`,
          params: { attemptId: attempt?._id },
        });

    } catch (e: any) {
        setClick(false);
        console.log('❌ Error starting quiz:', e);
    }
}

export const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};