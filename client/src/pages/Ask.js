import React from 'react';
import { useQuery } from '@apollo/client';

import { Questions } from '../utils/queries';

function Ask() {

    const { loading, error, data } = useQuery(Questions);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! {error.message}</div>;
    
    const questions = data.questions;
    
    return (
        <div className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold text-center mb-8">Ask a Question</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
            <div key={question._id} className="border rounded-lg shadow-md overflow-hidden">
                {question.images && question.images.length > 0 && (
                <img
                    src={question.images[0]} 
                    alt={question.title}
                    className="w-full h-48 object-cover"
                />
                )}
                <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
                <p className="text-gray-700">{question.description}</p>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }

export default Ask;