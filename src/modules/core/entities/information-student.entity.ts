import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CatalogueEntity, StudentEntity} from '@core/entities';

@Entity('information_students', {schema: 'core'})
export class InformationStudentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    updateAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
    })
    deletedAt: Date;

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'ancestral_language_name_id'})
    ancestralLanguageName: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'ancestral_language_name_id',
        nullable: true,
        comment: 'Lengua Ancestral: Andoa, Achuar'
    })
    ancestralLanguageNameId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'consume_news_type_id'})
    consumeNewsType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'consume_news_type_id',
        nullable: true,
        comment: 'A traves de que tipo de medio de comunicación consume noticias'
    })
    consumeNewsTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'contact_emergency_kinship_id'})
    contactEmergencyKinship: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'contact_emergency_kinship_id',
        nullable: true,
        comment: 'Parentesco, mama, papa, etc'
    })
    contactEmergencyKinshipId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'degree_superior_id'})
    degreeSuperior: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'degree_superior_id',
        nullable: true,
        comment: 'Cual titulo academico tiene ademas del bachillerato'
    })
    degreeSuperiorId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'disability_type_id'})
    disabilityType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'disability_type_id',
        nullable: true,
        comment: 'Tipo disacapasidad: Auditiva, Física, Intelectual, etc'
    })
    disabilityTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'electric_service_blackout_id'})
    electricServiceBlackout: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'electric_service_blackout_id',
        nullable: true,
        comment: '¿Con que frecuencia presenta apagones o cortes de luz en su vivienda?'
    })
    electricServiceBlackoutId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'electronic_device_id'})
    electronicDevice: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'electronic_device_id',
        nullable: true,
        comment: 'Computador de escritorio, Tablet, Celular, etc'
    })
    electronicDeviceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'family_kinship_catastrophic_illness_id'})
    familyKinshipCatastrophicIllness: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'family_kinship_catastrophic_illness_id',
        nullable: true,
        comment: 'Mama, Papa, Esposo/a, hermano/a, Hijo/a, Otros'
    })
    familyKinshipCatastrophicIllnessId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'family_kinship_disability_id'})
    familyKinshipDisability: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'family_kinship_disability_id',
        nullable: true,
        comment: 'Mama, Papa, Esposo/a, hermano/a, Hijo/a, Otros'
    })
    familyKinshipDisabilityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'family_income_id'})
    familyIncome: CatalogueEntity;
    @Column({type: 'uuid', name: 'family_income_id', nullable: true, comment: 'Ingresos familiares'})
    familyIncomeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'family_properties_id'})
    familyProperties: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'family_properties_id',
        nullable: true,
        comment: 'Terrenos, Casa, Local comercial, etc'
    })
    familyPropertiesId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'foreign_language_name_id'})
    foreignLanguageName: CatalogueEntity;
    @Column({type: 'uuid', name: 'foreign_language_name_id', nullable: true, comment: 'Ingles, Chino Mandarian, etc'})
    foreignLanguageNameId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'home_floor_id'})
    homeFloor: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'home_floor_id',
        nullable: true,
        comment: 'Principal material del techo de la vivienda'
    })
    homeFloorId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'home_ownership_id'})
    homeOwnership: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'home_ownership_id',
        nullable: true,
        comment: 'La vivienda en la que habita el estudiante es'
    })
    homeOwnershipId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'home_roof_id'})
    homeRoof: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'home_roof_id',
        nullable: true,
        comment: 'Principal material del techo de la vivienda'
    })
    homeRoofId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'home_type_id'})
    homeType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'home_type_id',
        nullable: true,
        comment: 'La vivienda en la que habita el estudiante es'
    })
    homeTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'home_wall_id'})
    homeWall: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'home_wall_id',
        nullable: true,
        comment: 'Principal material del techo de la vivienda'
    })
    homeWallId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'indigenous_nationality_id'})
    indigenousNationality: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'indigenous_nationality_id',
        nullable: true,
        comment: 'Epera, Chachis, Awa, Tsachila etc'
    })
    indigenousNationalityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'internet_type_id'})
    internetType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'internet_type_id',
        nullable: true,
        comment: 'Inalambricas y cableadas, Via satelite, Estandar Wi-Fi, Datos moviles, Fibra optica'
    })
    internetTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_ancestral_language_id'})
    isAncestralLanguage: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_ancestral_language_id', nullable: true, comment: 'Lengua Ancestral'})
    isAncestralLanguageId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_catastrophic_illness_id'})
    isCatastrophicIllness: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_catastrophic_illness_id',
        nullable: true,
        comment: 'Tiene enfermedad catastrofica: Si o No'
    })
    isCatastrophicIllnessId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_catastrophic_illness_id'})
    isFamilyCatastrophicIllness: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_catastrophic_illness_id',
        nullable: true,
        comment: 'Tiene enfermedad catastrofica: Si o No'
    })
    isFamilyCatastrophicIllnessId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_degree_superior_id'})
    isDegreeSuperior: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_degree_superior_id', nullable: true, comment: 'Tiene otro titulo'})
    isDegreeSuperiorId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_depends_economically_id'})
    isDependsEconomically: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_depends_economically_id',
        nullable: true,
        comment: '¿El estudiante depende economicamente de otra persona?'
    })
    isDependsEconomicallyId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_disability_id'})
    isDisability: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_disability_id', nullable: true, comment: 'Tiene disacapasidad'})
    isDisabilityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_discrimination_id'})
    isDiscrimination: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_discrimination_id',
        nullable: true,
        comment: 'Alguna vez ha sido usted objeto de discriminación'
    })
    isDiscriminationId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'economic_contribution_id'})
    economicContribution: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'economic_contribution_id',
        nullable: true,
        comment: 'Para sus estudios recibe el aporte ecónomico de:'
    })
    economicContributionId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_electric_service_id'})
    isElectricService: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_electric_service_id',
        nullable: true,
        comment: '¿Cuenta con servicio de electricidad (Luz)?'
    })
    isElectricServiceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_electronic_device_id'})
    isElectronicDevice: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_electronic_device_id',
        nullable: true,
        comment: '¿Usted Cuenta con un equipo tecnológico?'
    })
    isElectronicDeviceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_executed_community'})
    isExecutedCommunity: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_executed_community', nullable: true, comment: 'Realizo trabajo comunitario'})
    isExecutedCommunityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_executed_practice_id'})
    isExecutedPractice: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_executed_practice_id',
        nullable: true,
        comment: 'Realizo practicas preprofesionales'
    })
    isExecutedPracticeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_disability_id'})
    isFamilyDisability: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_disability_id',
        nullable: true,
        comment: 'Tiene disacapasidad algun familiar'
    })
    isFamilyDisabilityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_economic_aid_id'})
    isFamilyEconomicAid: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_economic_aid_id',
        nullable: true,
        comment: 'Algún miembro del grupo familiar es beneficiario de algún bono beca o ayuda económica'
    })
    isFamilyEconomicAidId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_emigrant_id'})
    isFamilyEmigrant: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_emigrant_id',
        nullable: true,
        comment: 'Tiene disacapacidad algun familiar'
    })
    isFamilyEmigrantId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_properties_id'})
    isFamilyProperties: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_properties_id',
        nullable: true,
        comment: 'La familia tiene otras propiedades distintas a su domicilio'
    })
    isFamilyPropertiesId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_family_vehicle_id'})
    isFamilyVehicle: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_family_vehicle_id',
        nullable: true,
        comment: 'La familia dispone de vehículo propio'
    })
    isFamilyVehicleId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_foreign_language_id'})
    isForeignLanguage: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_foreign_language_id', nullable: true, comment: 'Perdida de gratuidad'})
    isForeignLanguageId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_gender_violence_id'})
    isGenderViolence: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_gender_violence_id',
        nullable: true,
        comment: 'Usted alguna vez ha sido víctima de violencia de género'
    })
    isGenderViolenceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_has_children_id'})
    isHasChildren: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_has_children_id', nullable: true, comment: 'Tiene Hijos'})
    isHasChildrenId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_house_head_id'})
    isHouseHead: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_house_head_id', nullable: true, comment: 'Es Jefe de Hogar'})
    isHouseHeadId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_injuries_id'})
    isInjuries: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_injuries_id',
        nullable: true,
        comment: 'Alguna vez ha tenido pensamientos o ha intentado hacerse daño a sí mismo'
    })
    isInjuriesId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_internet_id'})
    isInternet: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_internet_id', nullable: true, comment: 'Posee Cobertura Internet: Si o No'})
    isInternetId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_lost_gratuity_id'})
    isLostGratuity: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_lost_gratuity_id', nullable: true, comment: 'Perdida de gratuidad'})
    isLostGratuityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_phone_service_id'})
    isPhoneService: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_phone_service_id',
        nullable: true,
        comment: '¿Posee el servicio basico de telefono en su vivienda ?'
    })
    isPhoneServiceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_private_security_id'})
    isPrivateSecurity: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_private_security_id', nullable: true, comment: 'Es Jefe de Hogar'})
    isPrivateSecurityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_sewerage_service_id'})
    isSewerageService: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_sewerage_service_id',
        nullable: true,
        comment: '¿Posee el servicio basico de alcantarillado en su vivienda?'
    })
    isSewerageServiceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_social_security_id'})
    isSocialSecurity: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_social_security_id', nullable: true, comment: 'Es Jefe de Hogar'})
    isSocialSecurityId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_study_other_career_id'})
    isStudyOtherCareer: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_study_other_career_id',
        nullable: true,
        comment: 'Estudia otra carrera fuera del Yavirac'
    })
    isStudyOtherCareerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_subject_lost_id'})
    isSubjectLost: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_subject_lost_id', nullable: true, comment: 'Ha perdido asignaturas: si o no'})
    isSubjectLostId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_water_service_id'})
    isWaterService: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'is_water_service_id',
        nullable: true,
        comment: '¿En su vivienda posee el servicio basico de agua?'
    })
    isWaterServiceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'is_work_id'})
    isWork: CatalogueEntity;
    @Column({type: 'uuid', name: 'is_work_id', nullable: true, comment: 'El estudiante trabaja: Si o No'})
    isWorkId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'monthly_salary_id'})
    monthlySalary: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'monthly_salary_id',
        nullable: true,
        comment: 'Salario mensual por rangos'
    })
    monthlySalaryId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'pandemic_psychological_effect_id'})
    pandemicPsychologicalEffect: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'pandemic_psychological_effect_id',
        nullable: true,
        comment: 'Ansiedad, Estres, Depresion, etc'
    })
    pandemicPsychologicalEffectId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'social_group_id'})
    socialGroup: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'social_group_id',
        nullable: true,
        comment: 'Goticos, Raperos, Hipsters, etc'
    })
    socialGroupId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'student_live_id'})
    studentLive: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'student_live_id',
        nullable: true,
        comment: 'Con quien vive el estudiante'
    })
    studentLiveId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'town_id'})
    town: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'town_id',
        nullable: true,
        comment: 'Pueblo: Chibuleo, Cayambi, Karanki, etc'
    })
    townId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_discrimination_id'})
    typeDiscrimination: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'type_discrimination_id',
        nullable: true,
        comment: 'Edad, Genero, Origen etnico, etc'
    })
    typeDiscriminationId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_gender_violence_id'})
    typeGenderViolence: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'type_gender_violence_id',
        nullable: true,
        comment: 'Fisica, Emocional, Psicologica, etc'
    })
    typeGenderViolenceId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_injuries_id'})
    typeInjuries: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'type_injuries_id',
        nullable: true,
        comment: 'Me cortaba, Me quemaba la piel, Me golpeaba, etc'
    })
    typeInjuriesId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_school_id'})
    typeSchool: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'type_school_id',
        nullable: true,
        comment: 'Tipo de colegio del que proviene'
    })
    typeSchoolId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_study_other_career_id'})
    typeStudyOtherCareer: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'type_study_other_career_id',
        nullable: true,
        comment: 'Estudia otra carrera fuera del Yavirac'
    })
    typeStudyOtherCareerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'university_career_id'})
    universityCareer: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'university_career_id',
        nullable: true,
        comment: 'En su trayectoria universitaria ha realizado'
    })
    universityCareerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'sewerage_service_type_id'})
    sewerageServiceType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'sewerage_service_type_id',
        nullable: true,
        comment: '¿Que tipo de servicio de alcantarillado posee?'
    })
    sewerageServiceTypeId: string;

    @OneToOne(() => StudentEntity, student => student.informationStudent)
    @JoinColumn({name: 'student_id'})
    student: StudentEntity;
    @Column({type: 'uuid', name: 'student_id', comment: 'Estudiante que pertenece la informacion'})
    studentId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'water_service_type_id'})
    waterServiceType: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'water_service_type_id',
        nullable: true,
        comment: '¿Que tipo de agua tiene acceso en su domicilio?'
    })
    waterServiceTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'working_hours_id'})
    workingHours: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'working_hours_id',
        nullable: true,
        comment: 'Horario Laboral: Mañana (4 horas), Vespertino (4 hors), Nocturna ( 4 horas), Dia completo (8 horas), Velada Completa (8 horas) y otros'
    })
    workingHoursId: string;

    /** Columns **/
    @Column({
        name: 'additional_information',
        type: 'text',
        nullable: true,
        comment: 'Información adicional de estudiante',
    })
    additionalInformation: string;

    @Column({
        name: 'address',
        type: 'text',
        nullable: true,
        comment: 'La direccion donde reside el estudiante',
    })
    address: string;

    @Column({
        name: 'carnet_number',
        type: 'varchar',
        nullable: true,
        comment: 'Número de carnet de la persona con discapacidad',
    })
    carnetNumber: string;

    @Column({
        name: 'catastrophic_illness',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre de la enfermedad catastrofica',
    })
    catastrophicIllness: string;

    @Column({
        name: 'family_catastrophic_illness',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre de la enfermedad catastrofica de un familiar',
    })
    familyCatastrophicIllness: string;

    @Column({
        name: 'children_total',
        type: 'int',
        nullable: true,
        comment: 'Total de Hijos',
    })
    childrenTotal: number;

    @Column({
        name: 'community_hours',
        type: 'int',
        nullable: true,
        comment: 'Las horas realizadas por parte del estudiante en integracion con la sociedad',
    })
    communityHours: number;

    @Column({
        name: 'contact_emergency_name',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre del contacto de emergencia para informar sobre el estudiante',
    })
    contactEmergencyName: string;

    @Column({
        name: 'contact_emergency_phone',
        type: 'varchar',
        nullable: true,
        comment: 'Numeros de contacto de emergencia para informar sobre el estudiante',
    })
    contactEmergencyPhone: string;

    @Column({
        name: 'disability_percentage',
        type: 'float',
        nullable: true,
        comment: 'El porcentaje de discapicidad que tiene el estudiante ',
    })
    disabilityPercentage: number;

    @Column({
        name: 'economic_amount',
        type: 'float',
        nullable: true,
        comment: 'El monto de ayuda economica que el estudiante recibe',
    })
    economicAmount: number;

    @Column({
        name: 'educational_amount',
        type: 'float',
        nullable: true,
        comment: 'El monto de credito que el estudiante tiene',
    })
    educationalAmount: number;

    @Column({
        name: 'family_disability_percentage',
        type: 'float',
        nullable: true,
        comment: 'El porcentaje de discapicidad que tiene el familiar',
    })
    familyDisabilityPercentage: number;

    @Column({
        name: 'financing_scholarship_type',
        type: 'varchar',
        nullable: true,
        comment: 'Recibe el estudiante un financiamiento si =1, no = 2',
    })
    financingScholarshipType: string;

    @Column({
        name: 'members_house_number',
        type: 'int',
        nullable: true,
        comment: 'Numero de familiares con quien vive el estudiante',
    })
    membersHouseNumber: number;

    @Column({
        name: 'name_study_other_career',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre de la Institución',
    })
    nameStudyOtherCareer: string;

    @Column({
        name: 'postal_code',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo postal donde el estudiante reside',
    })
    postalCode: string;

    @Column({
        name: 'practice_hours',
        type: 'int',
        nullable: true,
        comment: 'Las horas realizadas por parte del estudiante en pasantias',
    })
    practiceHours: number;

    @Column({
        name: 'scholarship_amount',
        type: 'float',
        nullable: true,
        comment: 'El monto de beca que el estudiante obtuvo',
    })
    scholarshipAmount: number;

    @Column({
        name: 'tariff_scholarship_percentage',
        type: 'float',
        nullable: true,
        comment: 'El porcentaje de beca que cubre la institutcion el estudiante ',
    })
    tariffScholarshipPercentage: number;

    @Column({
        name: 'work_address',
        type: 'text',
        nullable: true,
        comment: 'Direccion del trabajo del estudiante',
    })
    workAddress: string;

    @Column({
        name: 'work_position',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo postal donde el estudiante reside',
    })
    workPosition: string;
}
